import { Factory, trait, Trait } from 'ember-cli-mirage';
import faker from 'faker';

import { ReviewPermissions } from 'ember-osf-web/models/provider';
import RegistrationProvider from 'ember-osf-web/models/registration-provider';

import { randomGravatar } from '../utils';

function randomAssets() {
    return {
        square_color_no_transparent: randomGravatar(100),
    };
}

export interface MirageRegistrationProvider extends RegistrationProvider {
    licensesAcceptableIds: string[];
}

export interface RegistrationProviderTraits {
    withBrand: Trait;
    withAllSchemas: Trait;
    withSchemas: Trait;
    submissionsNotAllowed: Trait;
    withModerators: Trait;
    currentUserIsModerator: Trait;
}

export default Factory.extend<MirageRegistrationProvider & RegistrationProviderTraits>({
    name(i: number) {
        return `provider-${i}`;
    },
    description() {
        return `${faker.lorem.paragraph()} Find out <a href="https://help.osf.io/">more</a>.`;
    },
    allowSubmissions: true,
    brandedDiscoveryPage: true,
    assets: randomAssets(),
    reviewsWorkflow: 'pre-moderation',
    permissions: [],

    afterCreate(provider, server) {
        provider.update({
            licensesAcceptable: [
                server.create('license', { name: 'MIT License' }),
                server.create('license', {
                    name: 'No license',
                    requiredFields: [
                        'year',
                        'copyrightHolders',
                    ],
                    text: 'Copyright {{year}} {{copyrightHolders}}',
                }),
            ],
        });
        if (!provider.shareSource) {
            provider.update({ shareSource: `share-${provider.name}` });
        }
    },

    withBrand: trait<RegistrationProvider>({
        afterCreate(provider, server) {
            provider.update({ brand: server.create('brand') });
        },
    }),
    withSchemas: trait<RegistrationProvider>({
        afterCreate(provider, server) {
            provider.update({ schemas: [server.schema.registrationSchemas.find('testSchema')] });
        },
    }),
    withAllSchemas: trait<RegistrationProvider>({
        afterCreate(provider, server) {
            provider.update(
                {
                    schemas: [
                        server.schema.registrationSchemas.find('testSchema'),
                        server.schema.registrationSchemas.find('testSchemaTwo'),
                        server.schema.registrationSchemas.find('testSchemaThree'),
                        server.schema.registrationSchemas.find('prereg_challenge'),
                        server.schema.registrationSchemas.find('open_ended_registration'),
                        server.schema.registrationSchemas.find('as_predicted_preregsitration'),
                        server.schema.registrationSchemas.find('registered_report_protocol_preregistration.'),
                        server.schema.registrationSchemas.find('osf_standard_pre_data_collection_registration'),
                        server.schema.registrationSchemas.find('replication_recipe_post_completion'),
                        server.schema.registrationSchemas.find('replication_recipe_pre_registration'),
                        server.schema.registrationSchemas.find('pre_registration_in_social_psychology'),
                    ],
                },
            );
        },
    }),
    submissionsNotAllowed: trait<RegistrationProvider>({
        afterCreate(provider) {
            provider.update({ allowSubmissions: false });
        },
    }),
    withModerators: trait<RegistrationProvider>({
        afterCreate(provider) {
            const moderatorList = server.createList('moderator', 4);
            provider.update({ moderators: moderatorList });
        },
    }),
    currentUserIsModerator: trait<RegistrationProvider>({
        afterCreate(provider, server) {
            const { currentUserId, currentUser } = server.schema.roots.first();
            const moderator = server.create('moderator', { id: currentUserId, user: currentUser! });
            provider.update({
                moderators: [moderator],
                permissions: [ReviewPermissions.ViewSubmissions],
            });
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'registration-provider': MirageRegistrationProvider;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        registrationProvider: MirageRegistrationProvider;
    } // eslint-disable-line semi
}
