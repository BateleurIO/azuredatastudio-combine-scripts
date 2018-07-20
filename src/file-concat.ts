import { Uri } from "vscode";
import * as fs from 'fs';

export class FileConcatenator {
    
    private items: string[] = [];
    private line = '*********************************************************************************';
    private addHeader(): any {
        this.items.push(`/*${this.line}`);
        this.items.push('* This is a concatenation of all the selected files, including files in subfolders.');
        this.items.push('* The start and end of each file contains a comment with its name, as well as a');
        this.items.push('* print statement.');
        this.items.push(`${this.line}*/`);
        this.items.push('');
    }
    private addFile(uri: Uri): any {
        let data = fs.readFileSync(uri.fsPath);
        this.items.push(`/*${this.line}`);
        this.items.push('* Start: ' + uri.fsPath);
        this.items.push(`${this.line}*/`);
        this.items.push(`print \'Start: ${uri.fsPath}\'`);
        this.items.push('GO');
        this.items.push('');
        this.items.push(<string><any>data);
        this.items.push('GO');
        this.items.push(`/*${this.line}`);
        this.items.push('* End: ' + uri.fsPath);
        this.items.push(`${this.line}*/`);
        this.items.push(`print \'End: ${uri.fsPath}\'`);
        this.items.push('GO');
        this.items.push('');
    }
    public getText() {
        return this.items.join('\n');
    }

    constructor(uriList: Uri[]) {
        this.addHeader();
        uriList.forEach(uri => {
            this.addFile(uri);
        });
    }
}