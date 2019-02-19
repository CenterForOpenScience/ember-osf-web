import { association, Factory, faker, trait, Trait } from 'ember-cli-mirage';

import User from 'ember-osf-web/models/user';

import { guid, guidAfterCreate } from './utils';

export interface MirageUser extends User {
    contributorIds: string[];
}

export interface UserTraits {
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

export default Factory.extend<MirageUser & UserTraits>({
    id: guid('user'),
    afterCreate(user, server) {
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

    withFiles: trait<MirageUser>({
        afterCreate(user, server) {
            server.createList('file', 5, { user });
        },
    }),

    withInstitutions: trait<MirageUser>({
        afterCreate(user, server) {
            server.createList('institution', 3, { users: [user] });
        },
    }),

    loggedIn: trait<MirageUser>({
        afterCreate(currentUser, server) {
            const root = server.schema.roots.first();
            if (root) {
                root.update({ currentUser });
            } else {
                server.create('root', { currentUser });
            }
        },
    }),

    withSettings: trait<MirageUser>({
        afterCreate(user, server) {
            server.create('user-setting', { user });
        },
    }),

    withAlternateEmail: trait<MirageUser>({
        afterCreate(user, server) {
            server.create('user-email', { user });
        },
    }),

    withUnconfirmedEmail: trait<MirageUser>({
        afterCreate(user, server) {
            server.create('user-email', { user, confirmed: false });
        },
    }),

    withUnverifiedEmail: trait<MirageUser>({
        afterCreate(user, server) {
            server.create('user-email', { user, verified: false });
        },
    }),

    withUnverifiedEmails: trait<MirageUser>({
        afterCreate(user, server) {
            server.create('user-email', { user, verified: false, isMerge: true });
            server.create('user-email', { user, verified: false, isMerge: false });
        },
    }),
    withUsRegion: trait<MirageUser>({
        afterCreate(user, server) {
            const defaultRegion = server.schema.regions.find('us');
            user.update({ defaultRegion });
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        user: MirageUser;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        users: MirageUser;
    } // eslint-disable-line semi
}
