/* eslint-env node */
module.exports = {
    framework: 'qunit',
    test_page: 'tests/index.html?hidepassed',
    disable_watching: true,
    launch_in_ci: [
        'Chrome',
        'Firefox',
    ],
    launch_in_dev: [
        'Chrome',
        'Firefox',
    ],
    browser_args: {
        Chrome: [
            '--headless',
            '--disable-gpu',
            '--remote-debugging-port=9222',
            '--no-sandbox',
        ],
        Firefox: [
            '-headless',
        ],
    },
};
