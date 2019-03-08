import { Uri } from "vscode";
import * as fs from 'fs';
import * as path from 'path';
import { GlobSync } from 'glob';

export class FullFileList {
    private _list: string[] = [];
    public get list() { return this._list; }

    constructor (private config: any, private rootPath: string, files: Uri[] | string[]) {
        files.forEach(uri => this.addFilesToList(uri));
        this._list = [...new Set(this.list)];
    }
    addFilesToList(uri: Uri | string) {
        if (typeof uri !== 'string') {
            uri = uri.fsPath;
        }
        for (const pattern of this.config.fileGlobs) {
            if (fs.lstatSync(uri).isDirectory()) {
                let finalPattern = pattern;
                if (!pattern.startsWith('**') && !path.isAbsolute(pattern)) {
                    const rootPattern = path.resolve(this.rootPath, pattern);
                    finalPattern = path.relative(uri, rootPattern);
                    const backNavIndex = finalPattern.search(/(\.\.\/)+|(\.\.\\)+/);
                    if (backNavIndex !== -1) {
                        continue;
                    }
                }
                var glob = new GlobSync(finalPattern, { cwd: uri, absolute: true });
                this.list.push(...glob.found.map(item => path.normalize(item.toUpperCase())));
            } else if (fs.lstatSync(uri).isFile()) {
                this.list.push(path.normalize(uri.toUpperCase()));
            }
        }
    }
}