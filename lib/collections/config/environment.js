/* eslint-env node */

module.exports = function(environment) {
    const ENV = {
        environment,
        hostAppName: 'collections',
        modulePrefix: 'collections',
        OSF: {
            shareSearchUrl: 'https://share.osf.io/api/v2/search/creativeworks/_search',
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
