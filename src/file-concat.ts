import * as fs from 'fs';

export class FileConcatenator {
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
    addToc(uriList: string[]): any {
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
    private addFile(uri: string): any {
        const currentLength = this.items.length;
        let data = this.removeBom(fs.readFileSync(uri, 'UTF-8')).toString().replace(/\r/, '').replace(/\u00ef\u00bb\u00bf/, '').split("\n");
        this.items.push(...this.replaceTagsArr(uri, this.config.scriptHeader));
        this.items.push(...data);
        this.items.push(...this.replaceTagsArr(uri, this.config.scriptFooter));
        if (currentLength !==  this.items.length) {
            this.lineNumbers[uri] = currentLength + 1;
        }
    }
    public getText() {
        return this.items.join('\n');
    }
    private removeBom(x: any) {
        // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
        // conversion translates it to FEFF (UTF-16 BOM)
        if (typeof x === 'string' && x.charCodeAt(0) === 0xFEFF) {
            return x.slice(1);
        }
    
        if (Buffer.isBuffer(x) && 
            x[0] === 0xEF && x[1] === 0xBB && x[2] === 0xBF) {
            return x.slice(3);
        }
    
        return x;
    }

    constructor(private config: any, uriList: string[]) {
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