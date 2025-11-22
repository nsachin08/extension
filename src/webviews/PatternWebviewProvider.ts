import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as cp from "child_process";
import { ProgressService } from "../services/ProgressService";
import { marked } from "marked";
import { PatternTreeProvider } from "../tree/PatternTreeProvider";

export class PatternWebviewProvider {
    constructor(
        private context: vscode.ExtensionContext,
        private progressService: ProgressService,
        private treeProvider?: PatternTreeProvider // optional, used for refreshing tree
    ) {}

    async openPattern(patternId: string) {
        const normalizedId = patternId.toLowerCase();

        // Prevent opening locked patterns
        if (!this.progressService.isUnlocked(normalizedId)) {
            vscode.window.showWarningMessage(
                `🔒 This pattern is locked. Complete previous patterns first.`
            );
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            "patternWebview",
            patternId,
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        // Read README.md
        const readmePath = path.join(this.context.extensionPath, "patterns", normalizedId, "README.md");
        let markdown = "";
        if (fs.existsSync(readmePath)) {
            markdown = fs.readFileSync(readmePath, "utf-8");
        } else {
            markdown = "README.md not found for this pattern.";
        }

        // Convert Markdown to HTML
        const htmlContent = marked.parse(markdown);

        // Set webview HTML
        panel.webview.html = this.getHtml(htmlContent);

        // Handle button clicks from webview
        panel.webview.onDidReceiveMessage(async message => {
            switch (message.command) {
                case 'openExercise':
                    this.openExerciseFiles(normalizedId);
                    break;
                case 'runTest':
                    this.runPatternTest(normalizedId, panel);
                    break;
            }
        });
    }

    private getHtml(content: string) {
        const nonce = getNonce();
        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Pattern</title>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
<style>
    body { font-family: sans-serif; padding: 20px; line-height: 1.5; }
    h1,h2,h3,h4,h5,h6 { color: #444; }
    pre { background: #f3f3f3; padding: 10px; border-radius: 5px; overflow-x: auto; }
    code { background: #f3f3f3; padding: 2px 4px; border-radius: 3px; }
    ul, ol { margin-left: 20px; }
    button { margin: 5px; padding: 5px 10px; font-size: 14px; cursor: pointer; }
    #output { margin-top:20px; padding:10px; background:#f8f8f8; border-radius:5px; white-space:pre-wrap; }
</style>
</head>
<body>
<div>${content}</div>
<div>
    <button id="openExercise">Open Exercise</button>
    <button id="runTest">Run Test</button>
</div>
<div id="output"></div>

<script nonce="${nonce}">
    const vscode = acquireVsCodeApi();

    document.getElementById('openExercise').addEventListener('click', () => {
        vscode.postMessage({ command: 'openExercise' });
    });

    document.getElementById('runTest').addEventListener('click', () => {
        vscode.postMessage({ command: 'runTest' });
    });

    window.addEventListener('message', event => {
        const message = event.data;
        if (message.command === 'showOutput') {
            const outputDiv = document.getElementById('output');
            outputDiv.textContent = message.text;
        }
    });
</script>
</body>
</html>`;
    }

    // Open all exercise files in editor
    private openExerciseFiles(patternId: string) {
        const exerciseFolder = path.join(this.context.extensionPath, 'patterns', patternId, 'exercise');
        if (!fs.existsSync(exerciseFolder)) {
            vscode.window.showErrorMessage("Exercise folder not found.");
            return;
        }

        fs.readdirSync(exerciseFolder).forEach(file => {
            const filePath = path.join(exerciseFolder, file);
            vscode.workspace.openTextDocument(filePath).then(doc => {
                vscode.window.showTextDocument(doc, { preview: false });
            });
        });
    }

    // Compile and run test, output shown in webview
    private runPatternTest(patternId: string, panel: vscode.WebviewPanel) {
        const patternFolder = path.join(this.context.extensionPath, 'patterns', patternId);
        const exerciseFolder = path.join(patternFolder, 'exercise');
        const testFolder = path.join(patternFolder, 'test');
        const outDir = path.join(patternFolder, 'out');

        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

        try {
            // Compile exercise files
            const exerciseFiles = fs.readdirSync(exerciseFolder)
                .filter(f => f.endsWith(".java"))
                .map(f => `"${path.join(exerciseFolder, f)}"`);

            if (exerciseFiles.length === 0) {
                panel.webview.postMessage({ command: 'showOutput', text: '❌ No Java files found in exercise folder.' });
                return;
            }

            cp.execSync(`javac -d "${outDir}" ${exerciseFiles.join(" ")}`, { stdio: 'inherit' });

            // Compile test files
            const testFiles = fs.readdirSync(testFolder)
                .filter(f => f.endsWith(".java"))
                .map(f => `"${path.join(testFolder, f)}"`);

            if (testFiles.length === 0) {
                panel.webview.postMessage({ command: 'showOutput', text: '❌ No Java test files found.' });
                return;
            }

            cp.execSync(`javac -cp "${outDir}" ${testFiles.join(" ")}`, { stdio: 'inherit' });

            // Run test class
            const packageName = this.progressService.PatternPackages[patternId] || patternId;
            const testClass = `patterns.${packageName}.test.Test${capitalize(packageName)}`;
            const output = cp.execSync(`java -cp "${outDir}" ${testClass}`, { encoding: 'utf-8' });

            // Show output in webview
            panel.webview.postMessage({ command: 'showOutput', text: output });

            // Unlock next pattern
            this.unlockNextPattern(patternId, panel);

        } catch (err: any) {
            const errMessage = err.stdout || err.message || 'Unknown error';
            panel.webview.postMessage({ command: 'showOutput', text: errMessage });
            console.error(err);
        }
    }

    private unlockNextPattern(currentPattern: string, panel: vscode.WebviewPanel) {
        const nextPattern = this.progressService.PatternOrder[currentPattern.toLowerCase()];
        if (nextPattern && !this.progressService.isUnlocked(nextPattern)) {
            this.progressService.unlockPattern(nextPattern);
            panel.webview.postMessage({ 
                command: 'showOutput', 
                text: `✅ Next pattern unlocked: ${nextPattern}` 
            });

            // Refresh the tree view so icon updates
            if (this.treeProvider) this.treeProvider.refresh();
        }
    }
}

// Utility functions
function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
