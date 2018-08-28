import { association, Factory } from 'ember-cli-mirage';
import config from 'ember-get-config';

const {
    featureFlagNames: {
        routes,
    },
} = config;

export default Factory.extend({
    activeFlags: Object.values(routes), // Pretend all routes are flagged on
    message: 'Welcome to the OSF API.',
    version: '2.8',
    links: {},
    currentUser: association(),
});
