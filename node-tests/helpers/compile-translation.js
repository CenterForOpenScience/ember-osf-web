const { spawnSync } = require('child_process');

module.exports = function(locale) {
    process.stdout.write(`Compiling translations for locale: ${locale}\n`);
    spawnSync('tsc', [
        `app/locales/${locale}/translations.ts`,
        '--module',
        'commonjs',
        '--outDir',
        `tmp/locales/${locale}`,
    ]);
};
