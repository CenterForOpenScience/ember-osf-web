/* eslint-env node */

const DotReporter = require('testem/lib/reporters/dot_reporter');

module.exports = {
    framework: 'qunit',
    test_page: 'tests/index.html?hidepassed&dockcontainer&nocontainer',
    disable_watching: true,
    reporter: new DotReporter(),
    parallel: 2,
    launch_in_ci: ['Chrome'],
    launch_in_dev: ['Chrome'],
    browser_start_timeout: 120,
    browser_args: {
        Chrome: {
            ci: [
                // --no-sandbox is needed when running Chrome inside a container
                process.env.CI ? '--no-sandbox' : null,
                '--headless',
                '--disable-dev-shm-usage',
                '--disable-software-rasterizer',
                '--mute-audio',
                '--remote-debugging-port=9222',
                '--window-size=1440,900',
            ].filter(Boolean),
        },
    },
};
