import { Factory, faker, trait, Trait } from 'ember-cli-mirage';

import User from 'ember-osf-web/models/user';

import { guid } from './utils';

interface UserTraits {
    withNodes: Trait;
    loggedIn: Trait;
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
        return [`${faker.name.firstName()} ${faker.name.firstName()}`];
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
    profileImage() {
        const image = `https://www.gravatar.com/avatar/${faker.random.uuid().replace(/-/g, '')}?d=identicon`;
        return image;
    },
    acceptedTermsOfService: true,
    canViewReviews: false,
    social: {},
    dateRegistered() {
        return faker.date.past();
    },

    withNodes: trait({
        afterCreate(user, server) {
            server.createList('node', 5, { user }, 'withContributors');
        },
    }),

    loggedIn: trait({
        afterCreate(currentUser, server) {
            server.create('root', { currentUser });
        },
    }),
});
