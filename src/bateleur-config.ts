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
        let config = this.config;
        if (!config.fileGroups) {
            const newObj = {};
            Object.assign(newObj, config);
            config = {
                "fileGroups": [newObj]
            };
        } 
        for (var index = 0; index < config.fileGroups.length; index++) {
            let item = config.fileGroups[index];
            if (!item.replaceDefault) {
                item = {...vscodeConfig, ...item};
                config.fileGroups[index] = item;
            }
        }
        return config;
    }
}