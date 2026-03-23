const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * Checks if a file contains NUL (0x00) bytes
 *
 * @param {string} filePath - File path to check
 * @returns {Promise<boolean>} - True if the file contains NUL bytes
 */
async function isNulFile(filePath) {
    try {
        const buffer = await fs.promises.readFile(filePath);

        if (buffer.length === 0) {
            return false;
        }

        for (let i = 0; i < buffer.length; i++) {
            if (buffer[i] !== 0x00) {
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error(`Error reading file: ${filePath}`, error);
        return false;
    }
}

/**
 * Recursively finds NUL files in a directory
 *
 * @param {string} directoryPath - Directory path to scan
 * @returns {Promise<string[]>} - List of found NUL file paths
 */
async function findNulFiles(directoryPath) {
    const nulFiles = [];

    try {
        const entries = await fs.promises.readdir(directoryPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(directoryPath, entry.name);

            if (entry.isDirectory()) {
                if (entry.name !== 'node_modules' && entry.name !== '.git') {
                    const subDirNulFiles = await findNulFiles(fullPath);
                    nulFiles.push(...subDirNulFiles);
                }
            } else if (entry.isFile()) {
                if (await isNulFile(fullPath)) {
                    nulFiles.push(fullPath);
                }
            }
        }
    } catch (error) {
        console.error(`Error scanning directory: ${directoryPath}`, error);
    }

    return nulFiles;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Nul Hunter extension is active!');

    const findCommand = vscode.commands.registerCommand('nulhunter.findNulFiles', async function () {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;

            if (!workspaceFolders || workspaceFolders.length === 0) {
                vscode.window.showWarningMessage('No open workspace found!');
                return;
            }

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Searching for NUL files...",
                cancellable: false
            }, async () => {
                try {
                    let allNulFiles = [];

                    for (const folder of workspaceFolders) {
                        const nulFiles = await findNulFiles(folder.uri.fsPath);
                        allNulFiles = [...allNulFiles, ...nulFiles];
                    }

                    if (allNulFiles.length === 0) {
                        vscode.window.showInformationMessage('No NUL files found.');
                    } else {
                        const message = `Found ${allNulFiles.length} NUL file(s).`;
                        const cleanOption = 'Clean';

                        const selected = await vscode.window.showInformationMessage(message, cleanOption);

                        if (selected === cleanOption) {
                            vscode.commands.executeCommand('nulhunter.cleanNulFiles');
                        }
                    }
                } catch (error) {
                    console.error('Error searching for NUL files:', error);
                    vscode.window.showErrorMessage(`Error: ${error.message}`);
                }
            });
        } catch (error) {
            console.error('Error running command:', error);
            vscode.window.showErrorMessage(`Unexpected error: ${error.message}`);
        }
    });

    const cleanCommand = vscode.commands.registerCommand('nulhunter.cleanNulFiles', async function (resource) {
        try {
            let targetPath;

            if (resource && resource.fsPath) {
                targetPath = resource.fsPath;
            } else {
                const workspaceFolders = vscode.workspace.workspaceFolders;

                if (!workspaceFolders || workspaceFolders.length === 0) {
                    vscode.window.showWarningMessage('No open workspace found!');
                    return;
                }

                if (workspaceFolders.length === 1) {
                    targetPath = workspaceFolders[0].uri.fsPath;
                } else {
                    const folderOptions = workspaceFolders.map(folder => ({
                        label: folder.name,
                        description: folder.uri.fsPath,
                        fsPath: folder.uri.fsPath
                    }));

                    const selected = await vscode.window.showQuickPick(folderOptions, {
                        placeHolder: 'Which workspace should have its NUL files cleaned?'
                    });

                    if (!selected) {
                        return;
                    }

                    targetPath = selected.fsPath;
                }
            }

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Cleaning NUL files...",
                cancellable: false
            }, async (progress) => {
                try {
                    const nulFiles = await findNulFiles(targetPath);

                    if (nulFiles.length === 0) {
                        vscode.window.showInformationMessage('No NUL files found.');
                        return;
                    }

                    const confirmMessage = `Found ${nulFiles.length} NUL file(s). Do you want to delete them?`;
                    const confirmOption = 'Yes, Delete';

                    const confirmed = await vscode.window.showWarningMessage(confirmMessage, { modal: true }, confirmOption);

                    if (confirmed !== confirmOption) {
                        return;
                    }

                    let deletedCount = 0;
                    let totalSize = 0;

                    for (const nulFile of nulFiles) {
                        try {
                            const stats = await fs.promises.stat(nulFile);
                            totalSize += stats.size;

                            await fs.promises.unlink(nulFile);
                            deletedCount++;

                            progress.report({
                                message: `Deleted ${deletedCount}/${nulFiles.length}`,
                                increment: (1 / nulFiles.length) * 100
                            });
                        } catch (error) {
                            console.error(`Error deleting file: ${nulFile}`, error);
                        }
                    }

                    const sizeInKB = (totalSize / 1024).toFixed(2);
                    vscode.window.showInformationMessage(`Cleaning completed! Deleted ${deletedCount} NUL file(s) (${sizeInKB} KB).`);
                } catch (error) {
                    console.error('Error cleaning NUL files:', error);
                    vscode.window.showErrorMessage(`Error: ${error.message}`);
                }
            });
        } catch (error) {
            console.error('Error running command:', error);
            vscode.window.showErrorMessage(`Unexpected error: ${error.message}`);
        }
    });

    context.subscriptions.push(findCommand, cleanCommand);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
