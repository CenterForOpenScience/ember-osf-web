import DS from '@ember-data';

import OsfModel from './osf-model';

const { attr, belongsTo, hasMany } = DS;

export default class <%= classifiedModuleName %>Model extends OsfModel {
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        '<%= dasherizedModuleName %>': <%= classifiedModuleName %>Model;
    } // eslint-disable-line semi
}
