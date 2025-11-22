import * as vscode from "vscode";
import { PatternTreeProvider } from "./tree/PatternTreeProvider";
import { ProgressService } from "./services/ProgressService";
import { PatternWebviewProvider } from "./webviews/PatternWebviewProvider";

export function activate(context: vscode.ExtensionContext) {
    const progressService = new ProgressService(context.globalState);

    const treeProvider = new PatternTreeProvider(progressService, context.extensionUri);
    const webviewProvider = new PatternWebviewProvider(context, progressService);

    vscode.window.registerTreeDataProvider("lldTrainer.explorer", treeProvider);

    vscode.commands.registerCommand("lldTrainer.refreshTree", () => {
        treeProvider.refresh();
    });

    const openCommand = vscode.commands.registerCommand(
        "lldTrainer.openPattern",
        (patternId: string) => {
            webviewProvider.openPattern(patternId);
        }
    );

    context.subscriptions.push(openCommand);
}

export function deactivate() {}
