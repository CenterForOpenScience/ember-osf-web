import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import DS from 'ember-data';

import OsfModel from './osf-model';

export default class SubjectModel extends OsfModel {
    @attr('fixstring') text!: string;

    @belongsTo('subject')
    parent?: DS.PromiseObject<SubjectModel> & SubjectModel;

    @hasMany('subject', { inverse: 'parent' })
    children!: DS.PromiseManyArray<SubjectModel>;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'subject': SubjectModel;
    } // eslint-disable-line semi
}
