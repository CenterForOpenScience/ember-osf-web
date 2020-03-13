import RegistrationProvider from 'ember-osf-web/models/registration-provider';

import { randomGravatar } from '../utils';

function randomAssets() {
    return {
        square_color_no_transparent: randomGravatar(100),
    };
}

interface MirageRegistrationProvider extends RegistrationProvider {
    licensesAcceptableIds: string[];
    brandAsset: any;
}

const registrationProviders: Array<Partial<MirageRegistrationProvider>> = [
    {
        id: 'osf',
        name: 'OSF Registries',
        description: 'The open registries network',
        allowSubmissions: true,
        assets: randomAssets(),
        brandAsset: null,
        licensesAcceptableIds: [
            '5c252c8e0989e100220edb70',
            '5c252c8e0989e100220edb7a',
            '5c252c8e0989e100220edb76',
            '5c252c8e0989e100220edb74',
            '5c252c8e0989e100220edb71',
            '5c252c8e0989e100220edb75',
            '5c252c8e0989e100220edb73',
            '5c252c8e0989e100220edb7b',
            '5c252c8e0989e100220edb7f',
            '5c252c8e0989e100220edb7e',
            '5c252c8e0989e100220edb72',
            '5c252c8e0989e100220edb6f',
            '5c252c8e0989e100220edb7d',
            '5c252c8e0989e100220edb7c',
            '5c252c8e0989e100220edb6e',
            '5c252c8e0989e100220edb78',
        ],
    },
];

export default registrationProviders as MirageRegistrationProvider[];

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        registrationProviders: MirageRegistrationProvider;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'registration-provider': MirageRegistrationProvider;
    } // eslint-disable-line semi
}
