import { Uri } from "vscode";
import * as fs from 'fs';
import * as path from 'path';

export class FullFileList {
    private _list: Uri[] = [];
    public get list() { return this._list; }

    constructor (files: Uri[]) {
        files.forEach(uri => this.addFilesToList(uri));
    }
    addFilesToList(uri: Uri) {
        if (fs.lstatSync(uri.fsPath).isDirectory()) {
            let children = fs.readdirSync(uri.fsPath);
            children.forEach(child => {
                let childUri = Uri.parse(path.join(uri.fsPath, child));
                this.addFilesToList(childUri);
            });
        } else {
            if (!fs.lstatSync(uri.fsPath).isFile() || path.extname(uri.fsPath).toUpperCase() !== '.SQL') {
                return;
            }
            this.list.push(uri);
        }
    }
}