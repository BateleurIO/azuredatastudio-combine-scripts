'use strict';

import * as vscode from 'vscode';
// import * as sqlops from 'sqlops';
import * as fs from 'fs';
import * as tmp from 'tmp';
import { FullFileList } from './full-file-list';
import { FileConcatenator } from './file-concat';

export function activate(context: vscode.ExtensionContext) {
    let config = vscode.workspace.getConfiguration('combineScripts');
    context.subscriptions.push(vscode.commands.registerCommand('extension.combineScripts', (selectedFile, fileList) => {
        let files = (new FullFileList(fileList)).list;
        let text = (new FileConcatenator(files)).getText();
        let tempName = tmp.tmpNameSync() + config.outputFileExt;
        fs.writeFileSync(tempName, text);
        vscode.workspace.openTextDocument(tempName).then(doc => {
            vscode.window.showTextDocument(doc);
        });
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