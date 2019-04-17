const fs = require('fs');
const os = require('os');
const process = require('process');
const { spawnSync } = require('child_process');

const config = require('../../config/environment');

module.exports = function(environment) {
    const configJSON = JSON.stringify(config(environment));
    const configTS = `import config from 'config/environment'; const testConfig: typeof config = ${configJSON}`;
    const tsFile = `${os.tmpdir()}/check-config-types-${environment}-${process.pid}.ts`;
    fs.writeFileSync(tsFile, configTS);
    const result = spawnSync(
        'tsc',
        [
            tsFile,
            '--baseUrl', `${__dirname}/../../`,
            '--noEmit',
            '--skipLibCheck',
        ],
        { encoding: 'utf8' },
    );
    fs.unlinkSync(tsFile);
    return result;
};
