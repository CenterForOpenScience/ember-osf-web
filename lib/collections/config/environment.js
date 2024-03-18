/* eslint-env node */

module.exports = function(environment) {
    const ENV = {
        environment,
        hostAppName: 'collections',
        modulePrefix: 'collections',
        OSF: {
            url: 'http://localhost:5000/',
        },
        whiteListedProviders: [
            'arXiv',
            'bioRxiv',
            'Cogprints',
            'PeerJ',
            'Research Papers in Economics',
            'Preprints.org',
        ],
    };

    return ENV;
};
