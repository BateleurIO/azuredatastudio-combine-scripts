import { Uri } from "vscode";
import * as fs from 'fs';
import * as vscode from 'vscode';
// import * as glob from 'glob';
import { GlobSync } from 'glob';

export class FullFileList {
    private _list: string[] = [];
    public get list() { return this._list; }
    private config: any = {};

    constructor (files: Uri[]) {
        this.config = vscode.workspace.getConfiguration('combineScripts');
        files.forEach(uri => this.addFilesToList(uri));
    }
    addFilesToList(uri: Uri) {
        for (const pattern of this.config.fileGlobs) {
            if (fs.lstatSync(uri.fsPath).isDirectory()) {
                var glob = new GlobSync(pattern, { cwd: uri.fsPath, absolute: true });
                this.list.push(...glob.found);
            } else if (fs.lstatSync(uri.fsPath).isFile()) {
                this.list.push(uri.fsPath);
            }
        }
    }
}