import { Factory, faker, trait, Trait } from 'ember-cli-mirage';

import config from 'ember-get-config';
import User from 'ember-osf-web/models/user';
import { NormalLinks } from 'osf-api';

import { guid } from './utils';

const { OSF: { apiUrl } } = config;
export interface UserTraits {
    withNodes: Trait;
    withFiles: Trait;
    loggedIn: Trait;
    normalLinks: NormalLinks;
}

export default Factory.extend<User & UserTraits>({
    id(i: number) {
        return guid(i, 'user');
    },
    fullName() {
        return `${faker.name.firstName()} ${faker.name.lastName()}`;
    },
    givenName() {
        return faker.name.firstName();
    },
    middleNames() {
        return `${faker.name.firstName()} ${faker.name.firstName()}`;
    },
    familyName() {
        return faker.name.lastName();
    },
    suffix() {
        return faker.name.suffix();
    },
    locale() {
        return 'en_US';
    },
    active: true,
    timezone() {
        return 'America/New_York';
    },
    acceptedTermsOfService: true,
    canViewReviews: false,
    social: {},
    dateRegistered() {
        return faker.date.past();
    },
    normalLinks(i: number) {
        return {
            self: `${apiUrl}/v2/users/${guid(i, 'user')}/`,
            profile_image: `https://www.gravatar.com/avatar/${faker.random.uuid().replace(/-/g, '')}?d=identicon`,
        };
    },

    withNodes: trait({
        afterCreate(user, server) {
            server.createList('node', 5, { user }, 'withContributors');
        },
    }),
    loggedIn: trait({
        afterCreate(currentUser, server) {
            server.create('root', { currentUser });
            server.createList('file', 5, { user: currentUser });
        },
    }),
});
