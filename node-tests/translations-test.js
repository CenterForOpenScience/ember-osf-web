const { spawnSync } = require('child_process');
const flatten = require('flat');
const fs = require('fs');
const { expect } = require('chai');

if (!fs.existsSync('tmp/locales/en/translations.js')) {
    spawnSync('tsc', ['app/locales/en/translations.ts', '--module', 'commonjs', '--outDir', 'tmp/locales/en/']);
}
const english = require('../tmp/locales/en/translations.js').default;

fs.unlinkSync('tmp/locales/en/translations.js');
fs.rmdirSync('tmp/locales/en/');
const englishTerms = flatten(english);

fs.readdirSync('tmp/locales/').forEach(locale => {
    if (locale === 'en') return;
    describe(`locale: ${locale}`, () => {
        it('contains all terms', () => {
            // eslint-disable-next-line global-require, import/no-dynamic-require
            const translations = require(`../tmp/locales/${locale}/translations.js`).default;
            fs.unlinkSync(`tmp/locales/${locale}/translations.js`);
            fs.rmdirSync(`tmp/locales/${locale}/`);
            const terms = flatten(translations);
            Object.keys(englishTerms)
                .forEach(term => expect(terms, `${term} not defined for locale: ${locale}.`).to.have.property(term));
        }).timeout(5000);
    });
});
