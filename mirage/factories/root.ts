import { association, Factory } from 'ember-cli-mirage';
import config from 'ember-get-config';
import { Links } from 'jsonapi-typescript';

import User from 'ember-osf-web/models/user';

const {
    featureFlagNames: {
        routes,
        navigation,
        storageI18n,
    },
} = config;

export interface Root {
    activeFlags: string[];
    message: string;
    version: string;
    links: Links;
    currentUser?: User;
}

export default Factory.extend<Root>({
    activeFlags: [
        ...Object.values(routes),
        ...Object.values(navigation),
        storageI18n,
        'ember_verify_email_modals',
        ...Object.values(routes), // Pretend all routes are flagged on
    ],
    message: 'Welcome to the OSF API.',
    version: '2.8',
    links: {},
    currentUser: association() as User,
});
