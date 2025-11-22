import * as vscode from "vscode";
import { ProgressService } from "../services/ProgressService";
import * as fs from "fs";
import * as path from "path";

export class PatternWebviewProvider {
    constructor(
        private context: vscode.ExtensionContext,
        private progressService: ProgressService
    ) {}

    openPattern(patternId: string) {
        const panel = vscode.window.createWebviewPanel(
            "patternWebview",
            `Pattern: ${patternId}`,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(this.context.extensionUri, "patterns")
                ]
            }
        );

        panel.webview.html = this.getWebviewContent(patternId, panel);

        panel.webview.onDidReceiveMessage((msg: any) => {
            if (msg.command === "complete") {
                this.progressService.unlockPattern(patternId);
                vscode.commands.executeCommand("lldTrainer.refreshTree");
                vscode.window.showInformationMessage(`${patternId} marked as complete!`);
            }
        });
    }

   private getWebviewContent(patternId: string, panel: vscode.WebviewPanel): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>${patternId}</title>
        <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { color: #007acc; }
            button { padding: 8px 12px; }
        </style>
    </head>
    <body>
        <h1>${patternId}</h1>
        <p>This is a minimal webview.</p>
        <button id="completeBtn">Mark as Complete</button>

        <script>
            const vscode = acquireVsCodeApi();
            document.getElementById('completeBtn').addEventListener('click', () => {
                vscode.postMessage({ command: 'complete' });
            });
        </script>
    </body>
    </html>
    `;
}



    // private getWebviewContent(patternId: string, panel: vscode.WebviewPanel): string {
         
    //     return `
    //     <!DOCTYPE html>
    //     <html lang="en">
    //     <head>
    //         <meta charset="UTF-8">
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //         <title>${patternId}</title>
    //         <style>
    //             body { font-family: sans-serif; padding: 15px; }
    //             h1 { color: #007acc; }
    //             pre { background: #f3f3f3; padding: 10px; overflow-x: auto; }
    //             button { margin-top: 15px; padding: 8px 12px; font-size: 14px; }
    //         </style>
    //     </head>
    //     <body>
    //         <h1>${patternId}</h1>
    //         <h2>README</h2>
    //     </body>
    //     </html>
    //     `;
    // }
}
