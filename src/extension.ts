'use strict';

import * as vscode from 'vscode';
// import * as sqlops from 'sqlops';
import * as fs from 'fs';
import * as tmp from 'tmp';
import { FullFileList } from './full-file-list';
import { FileConcatenator } from './file-concat';
import { BateleurConfig } from './bateleur-config';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.combineScripts', async(selectedFile: any, fileList: any) => {
        const rootPath = <any>vscode.workspace.rootPath;
        const fileGroups = new BateleurConfig(rootPath).get.fileGroups;
        const outputFiles = [];
        if (!fileList) {
            fileList = [];
        }
        if (fileList.length === 0) {
            if (selectedFile) {
                fileList.push(selectedFile);
            } else {
                fileList.push(rootPath);
            }
        }
        for (const config of fileGroups) {
            const files = (new FullFileList(config, rootPath, fileList)).list;
            const fileLists = {};
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

                let outputFileName = config.outputFileName || tmp.tmpNameSync() + '.' + key;
                if (!path.isAbsolute(outputFileName)) {
                    outputFileName = path.join(rootPath, outputFileName);
                }
                fs.writeFileSync(outputFileName, text);
                outputFiles.push(outputFileName);
            }
        }

        for (const outputFileName of outputFiles) {
            const doc = await vscode.workspace.openTextDocument(outputFileName);
            await vscode.window.showTextDocument(doc, { preview: false });
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