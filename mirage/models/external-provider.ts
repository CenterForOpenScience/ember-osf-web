import { Collection, hasMany, Model } from 'ember-cli-mirage';
import { MirageExternalRegistration } from './external-registration';

export interface MirageExternalProvider {
    registrations: Collection<MirageExternalRegistration>;
    shareSourceKey: string;
}

export default Model.extend({
    registrations: hasMany('external-registration'),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'external-provider': MirageExternalProvider;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        externalProviders: MirageExternalProvider;
    } // eslint-disable-line semi
}
