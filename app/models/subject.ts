import DS from 'ember-data';

import OsfModel from './osf-model';

const { attr, belongsTo, hasMany } = DS;

export default class SubjectModel extends OsfModel {
    @attr('fixstring') text!: string;
    @attr('fixstring') taxonomyName!: string;

    @belongsTo('subject', { inverse: 'children', async: false })
    parent?: SubjectModel;

    @hasMany('subject', { inverse: 'parent' })
    children!: DS.PromiseManyArray<SubjectModel>;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        subject: SubjectModel;
    } // eslint-disable-line semi
}
