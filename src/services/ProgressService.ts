import * as vscode from "vscode";

export class ProgressService {
    private unlockedPatterns: Set<string>;

    constructor(private globalState: vscode.Memento) {
        const stored = this.globalState.get<string[]>("unlockedPatterns", ["strategy"]);
        this.unlockedPatterns = new Set(stored);
    }

    isUnlocked(patternId: string): boolean {
        return this.unlockedPatterns.has(patternId);
    }

    unlockPattern(patternId: string) {
        if (!this.unlockedPatterns.has(patternId)) {
            this.unlockedPatterns.add(patternId);
            this.globalState.update(
                "unlockedPatterns",
                Array.from(this.unlockedPatterns)
            );
        }
    }
}
