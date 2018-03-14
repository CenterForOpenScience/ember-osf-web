'use strict';

const fs = require('fs');
const Mocha = require('mocha');
const compileTranslation = require('./helpers/compile-translation');

// Always need the english translations for comparison.
compileTranslation('en');

// If args are passed and they don't include english transaltions.
if (process.argv.length > 2 && !process.argv.slice(2).find(arg => /app\/locales\/en\/translations\.ts$/.test(arg))) {
    // Compile each arg that looks like a translation file.
    process.argv.slice(2).forEach(arg => {
        const found = arg.match(/app\/locales\/([^/]+)\/translations\.ts$/);
        if (found && found[1]) {
            const locale = found[1];
            if (locale === 'en') return;
            compileTranslation(locale);
        }
    });
} else {
    // Compile all non-english translation files.
    fs.readdirSync('app/locales/').forEach(locale => {
        if (locale === 'en') return;
        compileTranslation(locale);
    });
}

// Run the mocha test.
const mocha = new Mocha();
mocha.addFile('node-tests/translations-test.js');
mocha.run(failures => process.on('exit', () => process.exit(failures)));
