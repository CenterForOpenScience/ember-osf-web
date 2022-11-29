import { trait, Factory, Trait } from 'ember-cli-mirage';
import faker from 'faker';

import { placekitten } from 'ember-osf-web/mirage/utils';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import CollectionProviderModel from 'ember-osf-web/models/collection-provider';
import { ReviewPermissions } from 'ember-osf-web/models/provider';
import { SubscriptionFrequency } from 'ember-osf-web/models/subscription';

import { guid, guidAfterCreate } from './utils';

export interface MirageCollectionProvider extends CollectionProviderModel {
    primaryCollectionId: string | number;
}

interface CollectionProviderTraits {
    currentUserIsModerator: Trait;
    currentUserIsAdmin: Trait;
}
export default Factory.extend<MirageCollectionProvider & CollectionProviderTraits>({
    id: guid('collection-provider'),
    afterCreate(provider, server) {
        guidAfterCreate(provider, server);

        server.create('subscription', {
            id: `${provider.id}_new_pending_submissions`,
            eventName: 'new_pending_submissions',
            frequency: SubscriptionFrequency.Instant ,
        });
    },
    advisoryBoard: faker.lorem.paragraph,
    emailSupport: '',
    name: faker.lorem.word,
    domain: faker.internet.domainName,
    allowCommenting: false,
    assets: {
        favicon: placekitten(16, 16),
        square_color_transparent: placekitten(200, 200),
        square_color_no_transparent: placekitten(500, 200),
    },
    facebookAppId: '',
    footerLinks: '',
    allowSubmissions: true,
    example: '',
    domainRedirectEnabled: false,
    description() {
        return `${faker.lorem.paragraph()} Find out <a href="https://help.osf.io/">more</a>.`;
    },
    permissions: [],
    currentUserIsModerator: trait<CollectionProvider>({
        afterCreate(provider, server) {
            if (server.schema.roots.first()) {
                const { currentUserId, currentUser } = server.schema.roots.first();
                if (currentUserId && currentUser) {
                    const moderator = server.create('moderator', {
                        id: currentUserId,
                        user: currentUser,
                    });
                    provider.update({
                        moderators: [moderator],
                        permissions: [ReviewPermissions.ViewSubmissions],
                    });
                }
            }
        },
    }),
    currentUserIsAdmin: trait<CollectionProvider>({
        afterCreate(provider, server) {
            if (server.schema.roots.first()) {
                const { currentUserId, currentUser } = server.schema.roots.first();
                if (currentUserId && currentUser) {
                    const moderator = server.create('moderator', {
                        id: currentUserId,
                        user: currentUser,
                    }, 'asAdmin');
                    provider.update({
                        moderators: [moderator],
                        permissions: [ReviewPermissions.ViewSubmissions],
                    });
                }
            }
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        collectionProviders: MirageCollectionProvider;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageSchemaRegistry {
        collectionProviders: MirageCollectionProvider;
    } // eslint-disable-line semi
}

