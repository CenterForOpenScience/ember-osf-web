import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';

import OsfModel from './osf-model';

export default class SubjectModel extends OsfModel {
    @attr('fixstring') text!: string;
    @attr('fixstring') taxonomyName!: string;

    @belongsTo('subject', { inverse: 'children', async: false })
    parent?: SubjectModel;

    @hasMany('subject', { inverse: 'parent', async: false })
    children!: SubjectModel[];

    @alias('relationshipLinks.children.links.related.meta.count')
    childrenCount!: number;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'subject': SubjectModel;
    } // eslint-disable-line semi
}
