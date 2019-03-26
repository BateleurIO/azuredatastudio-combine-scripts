# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

* Nothing for now.

## [2.0.0] - 2019-03-26

### Overview
This is almost a complete rewrite of the extension, and it's much more customizable and capable than before.

### Added
1. A table of contents, showing line numbers for each file.
2. Customizable headers and footers for the TOC, the individual script files and the output file itself.
3. You can optionally specify an output filename, instead of having output dumped into a temporary file.
4. Multiple file groups, all with either shared or distinctive headers, footers and more.
5. Multiple output files. You can, for example, have one file for table changes, and another for data changes.
6. Run the extension directly from the command palette to include all the files in the workspace, or using multi-select from the explorer.
7. Configured directly in the Azure Data Studio user or workspace settings, or you can add a configuration file in the workspace root.

## [1.3.0] - 2018-07-20

### Changed

* Added GO statements after the PRINT statements, to ensure each statement is properly isolated.

## [1.2.0] - 2018-07-18

### Changed

* Added back the menu item.

## [1.1.0] - 2018-07-13

### Changed

* Small update to add print statements, so you can see the start and end of scripts as they execute.
* Also added an icon.

## [1.0.0] - 2018-07-11

* This is the initial release. Super excited.

