import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { ProgressService } from "../services/ProgressService";
import { Console } from "console";

export class PatternTreeProvider implements vscode.TreeDataProvider<PatternItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<PatternItem | null> = new vscode.EventEmitter<PatternItem | null>();
    readonly onDidChangeTreeData: vscode.Event<PatternItem | null> = this._onDidChangeTreeData.event;

    private patternsFolder: string;

    constructor(private progressService: ProgressService, private extensionUri: vscode.Uri) {
        this.patternsFolder = vscode.Uri.joinPath(this.extensionUri, "patterns").fsPath;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(null);
    }

    getTreeItem(element: PatternItem): vscode.TreeItem {
        return element;
    }

    getChildren(): Thenable<PatternItem[]> {
        if (!fs.existsSync(this.patternsFolder)) {
            vscode.window.showErrorMessage(`Patterns folder not found: ${this.patternsFolder}`);
            return Promise.resolve([]);
        }

        const patternDirs = fs.readdirSync(this.patternsFolder).filter((file) =>
            fs.statSync(path.join(this.patternsFolder, file)).isDirectory()
        );

        const items = patternDirs.map((dir) => {
            const unlocked = this.progressService.isUnlocked(dir);
            return new PatternItem(dir, dir, unlocked, this.extensionUri);
        });

        return Promise.resolve(items);
    }
}

export class PatternItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly patternId: string,
        unlocked: boolean,
        extensionUri: vscode.Uri
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);

        this.iconPath = unlocked
            ? vscode.Uri.joinPath(extensionUri, "resources/icons/unlocked.svg")
            : vscode.Uri.joinPath(extensionUri, "resources/icons/lock.svg");
        console.log(this.iconPath);

        this.command = {
            command: "lldTrainer.openPattern",
            title: "Open Pattern",
            arguments: [patternId],
        };
    }
}
