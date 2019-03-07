import * as vscode from 'vscode';
import * as cosmiconfig from 'cosmiconfig';

export class BateleurConfig {
    private config: cosmiconfig.Config = {};
    constructor(rootPath: string) {
        const explorer = cosmiconfig('combinescripts', {
            stopDir: rootPath
        });
        const searchResult = explorer.searchSync(rootPath);
        
        if (searchResult) {
            this.config = searchResult.config;         
        }
    }
    
    get get(): any {
        const vscodeConfig = vscode.workspace.getConfiguration('combineScripts');
        const cosmic = this.config;
        let result = {...vscodeConfig, ...cosmic};
        return result;
    }
}