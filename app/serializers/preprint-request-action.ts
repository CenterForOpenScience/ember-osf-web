import OsfSerializer from './osf-serializer';

export default class PreprintRequestActionSerializer extends OsfSerializer {
    attrs: any = {
        ...this.attrs, // from OsfSerializer
        actionTrigger: 'trigger',
    };
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'preprint-request-action': PreprintRequestActionSerializer;
    } // eslint-disable-line semi
}
