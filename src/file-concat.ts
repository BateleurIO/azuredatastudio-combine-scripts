import { Uri } from "vscode";
import * as fs from 'fs';
import * as vscode from 'vscode';

export class FileConcatenator {
    private config: vscode.WorkspaceConfiguration;
    private items: string[] = [];
    private lineNumbers: any = {};
    private tocIndex = 0;
    private replaceTagsArr(path: string, input: string[]): string[] {
        const that = this;
        return input.map(line => {
            return that.replaceTags(path, line);
        });
    }
    private replaceTags(path: string, line: string): string {
        const newLine = line.replace(/\$\{scriptPath\}/, path).replace(/\$\{lineNo\}/, this.lineNumbers[path]);
        return newLine;
    }
    addToc(uriList: Uri[]): any {
        this.items.push(...this.config.tocHeader);
        this.tocIndex = this.items.length;
        this.items.push(...uriList.map(() => ''));
        this.items.push(...this.config.tocFooter);
    }
    updateToc(): any {
        let idx = this.tocIndex;
        for (const entry in this.lineNumbers) {
            if (this.lineNumbers.hasOwnProperty(entry)) {
                this.items[idx++] = this.replaceTags(entry, this.config.tocEntry);
            }
        }
    }
    private addHeader(): any {
        this.items.push(...this.config.fileHeader);
    }
    private addFooter(): any {
        this.items.push(...this.config.fileFooter);
    }
    private readLines(input: any, func: any) {
        var remaining = '';
        
        input.on('data', function(data: any) {
            remaining += data;
            var index = remaining.indexOf('\n');
            while (index > -1) {
            var line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            func(line);
            index = remaining.indexOf('\n');
            }
        });
        
        input.on('end', function() {
            if (remaining.length > 0) {
            func(remaining);
            }
        });
    }
    private addFile(uri: Uri): any {
        const currentLength = this.items.length;
        let data = fs.readFileSync(uri.fsPath).toString().replace(/\r/, '').split("\n");
        this.items.push(...this.replaceTagsArr(uri.fsPath, this.config.scriptHeader));
        this.items.push(...data);
        this.items.push(...this.replaceTagsArr(uri.fsPath, this.config.scriptFooter));
        if (currentLength !==  this.items.length) {
            this.lineNumbers[uri.fsPath] = currentLength + 1;
        }
    }
    public getText() {
        return this.items.join('\n');
    }

    constructor(uriList: Uri[]) {
        this.config = vscode.workspace.getConfiguration('combineScripts');
        this.addHeader();
        if (this.config.includeToc) {
            this.addToc(uriList);
        }
        uriList.forEach(uri => {
            this.addFile(uri);
        });
        if (this.config.includeToc) {
            this.updateToc();
        }
        this.addFooter();
    }
}