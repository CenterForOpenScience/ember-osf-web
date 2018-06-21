const flatten = require('flat');
const fs = require('fs');
const os = require('os');
const path = require('path');
const process = require('process');
const { assert, expect } = require('chai');
const {
    describe, before, after, it,
} = require('mocha');

const compileTranslation = require('./helpers/compile-translation');

const transFiles = process.argv.slice(3);

const localesOutDir = `${os.tmpdir()}/locales-${process.pid}`;

describe('translations', () => {
    const locales = [];
    const compiledTransFiles = {};

    if (transFiles.length > 0 &&
        transFiles.find(file => /app\/locales\/\w+\/translations\.ts$/.test(file)) &&
        !transFiles.find(file => /app\/locales\/en\/translations\.ts$/.test(file))) {
        transFiles.forEach(arg => {
            const found = arg.match(/app\/locales\/([^/]+)\/translations\.ts$/);
            if (found && found[1]) {
                const locale = found[1];
                if (locale === 'en') return;
                locales.push(locale);
            }
        });
    } else {
        fs.readdirSync('app/locales/').forEach(locale => {
            if (locale === 'en') return;
            locales.push(locale);
        });
    }

    describe('translations compile', () => {
        it('en', () => {
            const { result, outFile } = compileTranslation('en', localesOutDir);
            assert.isOk(!result.status, result.stdout);
            compiledTransFiles.en = outFile;
        }).timeout(15000);

        locales.forEach(locale => {
            it(locale, () => {
                const { result, outFile } = compileTranslation(locale, localesOutDir);
                assert.isOk(!result.status, result.stdout);
                compiledTransFiles[locale] = outFile;
            }).timeout(15000);
        });
    });

    describe('other locales contain all terms defined in en', () => {
        let englishTerms;

        before(() => {
            // eslint-disable-next-line global-require, import/no-dynamic-require
            const english = require(compiledTransFiles.en).default;
            englishTerms = flatten(english);
        });

        locales.forEach(locale => {
            it(locale, () => {
                // eslint-disable-next-line global-require, import/no-dynamic-require
                const translations = require(compiledTransFiles[locale]).default;
                const terms = flatten(translations);
                Object.keys(englishTerms).forEach(
                    term => expect(terms, `${term} not defined for locale: ${locale}.`).to.have.property(term),
                );
            });
        });
    });

    after(() => {
        // Clean up tmp
        Object.values(compiledTransFiles).forEach(file => {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
                fs.rmdirSync(path.dirname(file));
            }
        });
        if (fs.existsSync(localesOutDir)) {
            fs.rmdirSync(localesOutDir);
        }
    });
});
