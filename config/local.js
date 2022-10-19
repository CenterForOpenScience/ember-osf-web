// This file is solely for developer convenience. Any of these settings may alternately be passed in as
// environment variables in your deployment environment

module.exports = {
    // Default is ability to read and write all data associated with a user's account. Some apps may not need full
    // account privileges. If your app only reads data, best practice is to limit permission requests to only what
    // you need.
    OAUTH_SCOPES: 'osf.full_write',
    // Where to send the user on the site after they authenticated. Usually this is a page enabled to handle the oauth
    // flow.
    REDIRECT_URI: 'http://localhost:4200/login',
    // The developer app client ID (not client secret!). This is needed for your app to let users log in via the OSF.
    CLIENT_ID: '',
    // Credentials for only a single user. This setting will be ignored except for local development; NEVER commit
    PERSONAL_ACCESS_TOKEN: '',


    HANDBOOK_ENABLED: 'false',
    MIRAGE_ENABLED: 'true',
    A11Y_AUDIT: 'false',
    TESTS_ENABLED: 'true',
    COLLECTIONS_ENABLED: 'true',
    MIRAGE_SCENARIOS: [
        'loggedIn',
        'dashboard',
        'settings',
        'forks',
        'meetings',
        'collections',
        'registrations',
    ],
};
