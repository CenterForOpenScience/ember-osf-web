import { attr, belongsTo, hasMany } from '@ember-data/model';

import OsfModel from './osf-model';

export default class <%= classifiedModuleName % > Model; extends OsfModel; {
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        '<%= dasherizedModuleName %>': <%= classifiedModuleName;  % > Model;
    } // eslint-disable-line semi
}
