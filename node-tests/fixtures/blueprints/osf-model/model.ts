import { attr, belongsTo, hasMany } from '@ember-decorators/data';

import OsfModel from './osf-model';

export default class FooBarModel extends OsfModel {
}

declare module 'ember-data' {
    interface ModelRegistry {
        'foo-bar': FooBarModel;
    }
}
