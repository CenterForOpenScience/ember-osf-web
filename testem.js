/* eslint-env node */

const DotReporter = require('testem/lib/reporters/dot_reporter');

module.exports = {
    framework: 'qunit',
    test_page: 'tests/index.html?hidepassed&dockcontainer&nocontainer',
    disable_watching: true,
    reporter: new DotReporter(),
    launch_in_ci: [
        'Chrome',
    ],
    launch_in_dev: [
        'Chrome',
    ],
    browser_args: {
        Chrome: [
            '--headless',
            '--remote-debugging-port=9222',
            '--no-sandbox',
        ],
        Firefox: [
            '-headless',
        ],
    },
};
