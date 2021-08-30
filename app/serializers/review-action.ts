import OsfSerializer from './osf-serializer';

export default class ReviewActionSerializer extends OsfSerializer {
    // Because `trigger` is a private method on DS.Model
    attrs: any = {
        ...this.attrs, // from OsfSerializer
        actionTrigger: 'trigger',
    };
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'review-action': ReviewActionSerializer;
    } // eslint-disable-line semi
}
