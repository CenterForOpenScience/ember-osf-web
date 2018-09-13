import { association, Factory } from 'ember-cli-mirage';
import config from 'ember-get-config';

import User from 'ember-osf-web/models/user';

const {
    featureFlagNames: {
        routes,
    },
} = config;

interface Root {
    activeFlags: string[];
    message: string;
    version: string;
    links: {};
    currentUser: User;
}

export default Factory.extend<Root>({
    activeFlags: Object.values(routes), // Pretend all routes are flagged on
    message: 'Welcome to the OSF API.',
    version: '2.8',
    links: {},
    currentUser: association() as User,
});
