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
    const appOrAddons = [];
    const locales = {};
    const compiledTransFiles = {};

    const addons = fs.readdirSync('lib');

    for (const addon of addons.concat(['app'])) {
        locales[addon] = [];
    }

    if (transFiles.length > 0) {
        ['app', ...addons].forEach(appOrAddon => {
            const baseDir = appOrAddon === 'app' ? 'app' : `lib/${appOrAddon}/addon`;

            const localeRegEx = new RegExp(`${baseDir}/locales/([^/]+)/translations\\.ts$`);

            if (transFiles.find(file => localeRegEx.test(file))) {
                appOrAddons.push(appOrAddon);
                const enRegEx = new RegExp(`${baseDir}/locales/en/translations\\.ts$`);
                if (transFiles.find(file => enRegEx.test(file))) {
                    fs.readdirSync(`${baseDir}/locales/`).forEach(locale => {
                        if (locale === 'en') return;
                        locales[appOrAddon] = locales[appOrAddon] ? [...locales[appOrAddon], locale] : [locale];
                    });
                } else {
                    transFiles.forEach(arg => {
                        const found = arg.match(localeRegEx);
                        if (found && found[1]) {
                            const locale = found[1];
                            if (locale === 'en') return;
                            locales[appOrAddon] = locales[appOrAddon] ? [...locales[appOrAddon], locale] : [locale];
                        }
                    });
                }
            }
        });
    } else {
        appOrAddons.push('app');
        fs.readdirSync('app/locales/').forEach(locale => {
            if (locale === 'en') return;
            locales.app = locales.app ? [...locales.app, locale] : [locale];
        });
        addons.forEach(addon => {
            if (fs.existsSync(`lib/${addon}/addon/locales/`)) {
                appOrAddons.push(addon);
                fs.readdirSync(`lib/${addon}/addon/locales/`).forEach(locale => {
                    if (locale === 'en') return;
                    locales[addon] = locales[addon] ? [...locales[addon], locale] : [locale];
                });
            }
        });
    }

    appOrAddons.forEach(appOrAddon => {
        describe(appOrAddon, () => {
            describe('translations compile', () => {
                it('en', () => {
                    const { result, outFile } = compileTranslation('en', appOrAddon, localesOutDir);
                    assert.isOk(!result.status, result.stdout);
                    compiledTransFiles[appOrAddon] = { ...compiledTransFiles[appOrAddon], en: outFile };
                }).timeout(15000);

                locales[appOrAddon].forEach(locale => {
                    it(locale, () => {
                        const { result, outFile } = compileTranslation(locale, appOrAddon, localesOutDir);
                        assert.isOk(!result.status, result.stdout);
                        compiledTransFiles[appOrAddon] = { ...compiledTransFiles[appOrAddon], [locale]: outFile };
                    }).timeout(15000);
                });
            });

            describe('other locales contain all terms defined in en', () => {
                let englishTerms;

                before(() => {
                    // eslint-disable-next-line global-require, import/no-dynamic-require
                    const english = require(compiledTransFiles[appOrAddon].en).default;
                    englishTerms = { ...englishTerms, [appOrAddon]: flatten(english) };
                });

                locales[appOrAddon].forEach(locale => {
                    it(locale, () => {
                        // eslint-disable-next-line global-require, import/no-dynamic-require
                        const translations = require(compiledTransFiles[appOrAddon][locale]).default;
                        const terms = flatten(translations);
                        Object.keys(englishTerms[appOrAddon]).forEach(
                            term => expect(terms, `${term} not defined for locale: ${locale}.`).to.have.property(term),
                        );
                    });
                });
            });
        });
    });

    after(() => {
        // Clean up tmp
        appOrAddons.forEach(appOrAddon => Object.values(compiledTransFiles[appOrAddon]).forEach(file => {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
                fs.rmdirSync(path.dirname(file));
            }
        }));
        appOrAddons.forEach(appOrAddon => {
            if (fs.existsSync(`${localesOutDir}/${appOrAddon}`)) {
                fs.rmdirSync(`${localesOutDir}/${appOrAddon}`);
            }
        });
        if (fs.existsSync(localesOutDir)) {
            fs.rmdirSync(localesOutDir);
        }
    });
});
