const { spawnSync } = require('child_process');

module.exports = function(locale, localesOutDir) {
    const outDir = `${localesOutDir}/${locale}`;
    return {
        result: spawnSync('tsc', [
            `app/locales/${locale}/translations.ts`,
            '--skipLibCheck',
            '--module',
            'commonjs',
            '--outDir',
            outDir,
        ]),
        outFile: `${outDir}/translations.js`,
    };
};
