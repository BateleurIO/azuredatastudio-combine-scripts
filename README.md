# Combine Scripts for Azure Data Studio

Ever needed to execute several scripts spread over several folders? Now you can select several files and folders and generate a single combined file to execute or ab/use any way you choose.

## Features

Just use `Ctrl` and `Shift` to select multiple files and folders, then right-click and choose *Combine Scripts*. 

If you select a folder, all SQL files in subfolders will also be included.

The result will be a single script containing the content of all the selected files. By default, there will also be comment blocks and print statements at the top and bottom of each file, as well as a table of contents at the top. You can configure all of this either in user settings, or a configuration file.

## Installation

1. Download the `.vsix` file from here: https://github.com/BateleurIO/azuredatastudio-combine-scripts/releases/latest
2. In Azure Data Studio, from the File menu, select *Install Extension From VSIX Package*. Alternatively, press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> and select *Extensions: Install from VSIX...*
3. Navigate to the file you downloaded and press *Install*.

## Configuration

You can change the default configuration in user/workspace settings, or you can place a configuration file named `.combinefilesrc.json` in the workspace root.

The file looks like this:

```json
{
    "fileGroups": [/*...*/]
}
```

Each entry in `fileGroups` can have one or more of the following properties:

*   `groupName` - Not used. Use this to label multiple configurations.
*   `outputFileName` - The name of the output file. If this is not specified, a temporary file is created.
*   `fileGlobs` - A list of glob patterns to match. A file is included if it matches *any* glob pattern. Defaults to `**/*.sql` if none is specified.
*   `fileHeader` - The lines of text to be placed at the beginning of the output.
*   `fileFooter` - The lines of text to be placed at the end of the output.
*   `includeToc` - A table of contents will be written after `fileHeader` but before the first `entryHeader` if this is `true`. Defaults to `false`.
*   `tocHeader` - If `includeToc === true`, the lines of text to be placed after the `fileHeader`, but before the first `tocEntry`.
*   `tocEntry` - If `includeToc === true`, the single line of text that is added once for each included file. Defaults to `'\t${lineNo}\t\t${entryPath}'`, which will show the line number and original file name for each entry.
*   `tocFooter` - If `includeToc === true`, the lines of text to be placed after the last `tocEntry`, but before the first `entryHeader`.
*   `entryHeader` - The lines of text to be placed at the beginning of each file entry. You can also include the `${entryPath}` variable anywhere in this value.
*   `entryFooter` - The lines of text to be placed at the end of each file entry. You can also include the `${entryPath}` variable anywhere in this value.

Here is the default configuration:

```json
{
    "fileGroups": [{
        "fileGlobs": [
            "**/*.sql"
        ],
        "fileHeader": [
            "/**********************************************************************************",
            "* This is a concatenation of all the selected files, including files in subfolders.",
            "* The start and end of each file contains a comment with its name, as well as a",
            "* print statement.",
            "***********************************************************************************"
        ],
        "includeToc": true,
        "tocHeader": [
            "* These are the line numbers for the included files:"
        ],
        "tocEntry": "* ${lineNo}\t\t${entryPath}",
        "tocFooter": [
            "***********************************************************************************/"
        ],
        "entryHeader": [
            "/*********************************************************************************",
            "* Start: ${entryPath}",
            "**********************************************************************************/",
            "print 'Start: ${entryPath}'",
            "GO"
        ],
        "entryFooter": [
            "GO",
            "/*********************************************************************************",
            "* End: ${entryPath}",
            "**********************************************************************************/",
            "print 'End: ${entryPath}'",
            "GO",
            "/*********************************************************************************/"
        ],
        "fileFooter": []
    }]
}
```

## See Also

- [Combine Files for Visual Studio Code](https://github.com/BateleurIO/vscode-combine-files) is the Microsoft Visual Studio Code version of this extension. The two are nearly identical, except that the Azure Data Studio version comes configured with defaults for `.sql` files. You can use it to combine other types as well. The VS Code version can be installed from the extensions panel.
- [Combine Files NPM Package](https://www.npmjs.com/package/@cobuskruger/combine-files) [(GitHub)](https://github.com/BateleurIO/combine-files) is an NPM package that combines files with all the same features as this extension.

