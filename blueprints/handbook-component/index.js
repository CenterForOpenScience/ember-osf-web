/* eslint-env node */

const fs = require('fs');
const path = require('path');

function updateFile({ action, line, filePath, startRegex, blockItemRegex }) {
    const allLines = fs.readFileSync(filePath, 'utf-8').split('\n');

    const blockStart = allLines.findIndex(l => l.match(startRegex)) + 1;
    const blockEnd = blockStart + allLines.slice(blockStart).findIndex(l => !l.match(blockItemRegex));
    const blockLines = allLines.slice(blockStart, blockEnd);

    if (action === 'add') {
        if (!blockLines.includes(line)) {
            blockLines.push(line);
            blockLines.sort();
        }
    } else if (action === 'remove') {
        const toRemove = blockLines.indexOf(line);
        if (toRemove > -1) {
            blockLines.splice(toRemove, 1);
        }
    } else {
        throw Error(`Expected action 'add' or 'remove', got: ${action}`);
    }

    allLines.splice(blockStart, blockEnd - blockStart, ...blockLines);

    fs.writeFileSync(filePath, allLines.join('\n'));
}

function updateHandbookRoutes(action, componentName) {
    updateFile({
        action,
        line: `${' '.repeat(12)}this.route('${componentName}');`,
        filePath: path.join('lib', 'handbook', 'addon', 'routes.js'),
        startRegex: /^\s+this\.route\('components', function\(\) {/,
        blockItemRegex: /^\s+this\.route\('[\w-]+'\);/,
    });
}

function updateHandbookNav(action, componentName) {
    updateFile({
        action,
        line: `${' '.repeat(8)}<nav.item @label='${componentName}' @route='docs.components.${componentName}' />`,
        filePath: path.join('lib', 'handbook', 'addon', 'docs', 'template.hbs'),
        startRegex: /^\s+<nav\.section @label='Component gallery' \/>/,
        blockItemRegex: /^\s+<nav\.item @label=/,
    });
}

module.exports = {
    description: 'Add a component to the Developer Handbook\'s component gallery',

    afterInstall(options) {
        this.ui.writeLine('adding route...');
        updateHandbookRoutes('add', options.entity.name);
        this.ui.writeLine('adding nav link...');
        updateHandbookNav('add', options.entity.name);
    },

    afterUninstall(options) {
        this.ui.writeLine('removing route...');
        updateHandbookRoutes('remove', options.entity.name);
        this.ui.writeLine('removing nav link...');
        updateHandbookNav('remove', options.entity.name);
    },
};
