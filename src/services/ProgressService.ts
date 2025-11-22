import * as vscode from "vscode";

export class ProgressService {
    private unlockedPatterns: Set<string>;

    // Define the sequential order of patterns
    public readonly PatternOrder: { [key: string]: string } = {
        strategy: "factory",
        factory: "abstractFactory",
        abstractFactory: "builder" // or next pattern if any
    };

    // Optional: mapping for exact package/folder names
    public readonly PatternPackages: { [key: string]: string } = {
        strategy: "strategy",
        factory: "factory",
        abstractFactory: "abstractFactory"
    };

    constructor(private globalState: vscode.Memento) {
        const stored = this.globalState.get<string[]>("unlockedPatterns", ["strategy"]); // only first unlocked
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

    getUnlockedPatterns(): string[] {
        return Array.from(this.unlockedPatterns);
    }

    resetProgress(firstPattern: string = "strategy") {
        this.unlockedPatterns = new Set([firstPattern]);
        this.globalState.update("unlockedPatterns", Array.from(this.unlockedPatterns));
    }

    hasSavedState(): boolean {
        const stored = this.globalState.get<string[]>("unlockedPatterns");
        return stored !== undefined && stored.length > 0;
    }
}
