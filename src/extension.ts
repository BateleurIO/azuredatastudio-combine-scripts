'use strict';

import * as vscode from 'vscode';
// import * as sqlops from 'sqlops';
import * as fs from 'fs';
import * as tmp from 'tmp';
import { FullFileList } from './full-file-list';
import { FileConcatenator } from './file-concat';
import { BateleurConfig } from './bateleur-config';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.combineScripts', (selectedFile: any, fileList: any) => {
        const config = new BateleurConfig(<any>vscode.workspace.rootPath).get;
        const files = (new FullFileList(config, fileList)).list;
        const fileLists = { };
        for (const file of files) {
            const ext = <any>(file.split('.').pop());
            if (!fileLists.hasOwnProperty(ext)) {
                fileLists[ext] = [];
            }
            fileLists[ext].push(file);
        }
        for (const key in fileLists) {
            if (!fileLists.hasOwnProperty(key)) {
                continue;
            }
            let text = (new FileConcatenator(config, fileLists[key])).getText();
            let tempName = tmp.tmpNameSync() + '.' + key;
            fs.writeFileSync(tempName, text);
            vscode.workspace.openTextDocument(tempName).then((doc: any) => {
                vscode.window.showTextDocument(doc);
            });
        }        
    }));

    // context.subscriptions.push(vscode.commands.registerCommand('extension.showCurrentConnection', () => {
    //     sqlops.connection.getCurrentConnection().then(connection => {
    //         let connectionId = connection ? connection.connectionId : 'No connection found!';
    //         vscode.window.showInformationMessage(connectionId);
    //     }, error => {
    //          console.info(error);
    //     });
    // }));
}

export function deactivate() {
}