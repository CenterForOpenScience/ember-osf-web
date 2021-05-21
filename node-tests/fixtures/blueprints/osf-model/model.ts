import { attr, belongsTo, hasMany } from '@ember-data/model';

import OsfModel from './osf-model';

export default class FooBarModel extends OsfModel {
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'foo-bar': FooBarModel;
    }
}
