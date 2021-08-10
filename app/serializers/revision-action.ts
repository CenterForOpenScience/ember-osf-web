import OsfSerializer from './osf-serializer';

export default class RevisionActionSerializer extends OsfSerializer {
    // Because `trigger` is a private method on DS.Model
    attrs: any = {
        ...this.attrs, // from OsfSerializer
        actionTrigger: 'trigger',
    };
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'revision-action': RevisionActionSerializer;
    } // eslint-disable-line semi
}
