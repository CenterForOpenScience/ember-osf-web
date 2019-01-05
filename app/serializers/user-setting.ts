import OsfSerializer from './osf-serializer';

export default class UserSettingSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'user-setting': UserSettingSerializer;
    } // eslint-disable-line semi
}
