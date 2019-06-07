import { association, Factory, ModelInstance, trait, Trait } from 'ember-cli-mirage';
import config from 'ember-get-config';
import { Links } from 'jsonapi-typescript';

import User from 'ember-osf-web/models/user';

const {
    featureFlagNames: {
        routes,
        navigation,
        storageI18n,
        verifyEmailModals,
    },
} = config;

export interface Root {
    activeFlags: string[];
    message: string;
    version: string;
    links: Links;
    currentUser: ModelInstance<User> | null;
    currentUserId?: string;
    _withAnonymizedVOL: boolean;
}

interface RootTraits {
    oldRegistrationDetail: Trait;
    loggedOut: Trait;
    withAnonymizedVOL: Trait;
}

export const defaultRootAttrs = {
    activeFlags: [...new Set([
        ...Object.values(routes),
        ...Object.values(navigation),
        storageI18n,
        verifyEmailModals,
    ])],
    message: 'Welcome to the OSF API.',
    version: '2.8',
    links: {},
    _withAnonymizedVOL: false,
};

export default Factory.extend<Root & RootTraits>({
    ...defaultRootAttrs,
    currentUser: association() as ModelInstance<User>,

    oldRegistrationDetail: trait<Root>({
        afterCreate(root) {
            root.update('activeFlags', root.activeFlags.filter(f => f !== routes['registries.overview']));
        },
    }),

    loggedOut: trait<Root>({
        currentUser: null,
    }),

    withAnonymizedVOL: trait<Root>({
        _withAnonymizedVOL: true,
    }),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        root: Root;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        roots: Root;
    } // eslint-disable-line semi
}
