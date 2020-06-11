import { belongsTo, Model } from 'ember-cli-mirage';
import { MirageExternalProvider } from './external-provider';

export interface MirageExternalRegistration {
    provider: MirageExternalProvider;
}

export default Model.extend({
    provider: belongsTo('external-provider'),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'external-registration': MirageExternalRegistration;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        externalRegistrations: MirageExternalRegistration;
    } // eslint-disable-line semi
}
