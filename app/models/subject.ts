import { AsyncHasMany, attr, belongsTo, hasMany } from '@ember-data/model';

import OsfModel from './osf-model';

export default class SubjectModel extends OsfModel {
    @attr('fixstring') text!: string;
    @attr('fixstring') taxonomyName!: string;

    @belongsTo('subject', { inverse: 'children', async: false })
    parent?: SubjectModel;

    @hasMany('subject', { inverse: 'parent' })
    children!: AsyncHasMany<SubjectModel>;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        subject: SubjectModel;
    } // eslint-disable-line semi
}
