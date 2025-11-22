import * as vscode from "vscode";
import { PatternTreeProvider } from "./tree/PatternTreeProvider";
import { ProgressService } from "./services/ProgressService";
import { PatternWebviewProvider } from "./webviews/PatternWebviewProvider";

export function activate(context: vscode.ExtensionContext) {
    const progressService = new ProgressService(context.globalState);
    const treeProvider = new PatternTreeProvider(progressService, context.extensionUri);
    const webviewProvider = new PatternWebviewProvider(context, progressService, treeProvider);

    vscode.window.registerTreeDataProvider("lldTrainer.explorer", treeProvider);

    context.subscriptions.push(
        vscode.commands.registerCommand("lldTrainer.refreshTree", () => treeProvider.refresh()),
        vscode.commands.registerCommand("lldTrainer.openPattern", (patternId: string) => webviewProvider.openPattern(patternId)),
        vscode.commands.registerCommand("lldTrainer.resetProgress", () => {
            progressService.resetProgress("strategy");
            vscode.window.showInformationMessage("✅ Progress reset to first pattern (Strategy).");
            treeProvider.refresh();
        }),
        vscode.commands.registerCommand("lldTrainer.showUnlockedPatterns", () => {
            const unlocked = progressService.getUnlockedPatterns();
            vscode.window.showInformationMessage(`Unlocked patterns: ${unlocked.join(", ")}`);
        })
    );

    if (progressService.hasSavedState()) {
        console.log("Existing progress found:", progressService.getUnlockedPatterns());
    } else {
        console.log("No previous progress found, starting fresh.");
    }
}

export function deactivate() {}
