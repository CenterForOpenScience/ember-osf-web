import {
    association,
    Factory,
    faker,
    ModelInstance,
    Server,
    trait,
    Trait,
} from 'ember-cli-mirage';

import User from 'ember-osf-web/models/user';

import { guid, guidAfterCreate } from './utils';

export interface UserTraits {
    withNodes: Trait;
    withFiles: Trait;
    loggedIn: Trait;
    withInstitutions: Trait;
    withSettings: Trait;
    withAlternateEmail: Trait;
    withUnconfirmedEmail: Trait;
    withUnverifiedEmail: Trait;
    withUnverifiedEmails: Trait;
    withUsRegion: Trait;
}

export default Factory.extend<User & UserTraits>({
    id: guid('user'),
    afterCreate(user: ModelInstance<User>, server: Server) {
        guidAfterCreate(user, server);
        server.create('user-email', { user, primary: true });
        if (!user.fullName && (user.givenName || user.familyName)) {
            user.update('fullName', [user.givenName, user.familyName].filter(Boolean).join(' '));
        }
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
    defaultRegion: association(),
    dateRegistered() {
        return faker.date.past(2, new Date(2018, 0, 0));
    },

    withNodes: trait({
        afterCreate(user, server) {
            server.createList('node', 5, { user }, 'withContributors');
        },
    }),

    withFiles: trait({
        afterCreate(user, server) {
            server.createList('file', 5, { user });
        },
    }),

    withInstitutions: trait({
        afterCreate(user, server) {
            server.createList('institution', 5, { users: [user] });
        },
    }),

    loggedIn: trait({
        afterCreate(currentUser, server) {
            const root = server.schema.roots.first();
            if (root) {
                root.update({ currentUser });
            } else {
                server.create('root', { currentUser });
            }
            server.createList('file', 5, { user: currentUser });
        },
    }),

    withSettings: trait({
        afterCreate(user, server) {
            server.create('user-setting', { user });
        },
    }),

    withAlternateEmail: trait({
        afterCreate(user, server) {
            server.create('user-email', { user });
        },
    }),

    withUnconfirmedEmail: trait({
        afterCreate(user, server) {
            server.create('user-email', { user, confirmed: false });
        },
    }),

    withUnverifiedEmail: trait({
        afterCreate(user, server) {
            server.create('user-email', { user, verified: false });
        },
    }),

    withUnverifiedEmails: trait({
        afterCreate(user, server) {
            server.create('user-email', { user, verified: false, isMerge: true });
            server.create('user-email', { user, verified: false, isMerge: false });
        },
    }),
    withUsRegion: trait({
        afterCreate(user, server) {
            const defaultRegion = server.schema.regions.find('us');
            user.update({ defaultRegion });
        },
    }),
});
