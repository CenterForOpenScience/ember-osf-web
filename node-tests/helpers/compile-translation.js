const { spawnSync } = require('child_process');

module.exports = function(locale, appOrAddon, localesOutDir) {
    const outDir = `${localesOutDir}/${appOrAddon}/${locale}`;
    const baseDir = appOrAddon === 'app' ? 'app' : `lib/${appOrAddon}/addon`;
    return {
        result: spawnSync('tsc', [
            `${baseDir}/locales/${locale}/translations.ts`,
            '--skipLibCheck',
            '--module',
            'commonjs',
            '--outDir',
            outDir,
        ]),
        outFile: `${outDir}/translations.js`,
    };
};
