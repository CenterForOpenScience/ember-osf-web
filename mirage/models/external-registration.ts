import { belongsTo, hasMany, Model, SchemaModelCollection } from 'ember-cli-mirage';
import Contributor from 'ember-osf-web/models/contributor';
import { MirageExternalProvider } from './external-provider';

export interface MirageExternalRegistration {
    id: string;
    title: string;
    description: string;
    dateModified: string;
    dateRegistered: string;
    provider: MirageExternalProvider;
    withdrawn?: boolean;
    withdrawalJustification?: string;
    isExternal: true;
    contributors: string[];
}

export default Model.extend({
    provider: belongsTo('external-provider'),
    isExternal: true,
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
