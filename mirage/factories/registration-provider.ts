import { Factory, faker, trait, Trait } from 'ember-cli-mirage';

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
}

export default Factory.extend<MirageRegistrationProvider & RegistrationProviderTraits>({
    name() {
        return faker.lorem.word();
    },
    description() {
        return faker.lorem.sentence();
    },
    shareSourceKey() {
        return 'OSF'; // will need to update this once custom source keys are implemented in Backend
    },
    allowSubmissions: true,
    assets: randomAssets(),

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
    },

    withBrand: trait<RegistrationProvider>({
        afterCreate(provider, server) {
            provider.update({ brand: server.create('brand') });
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
