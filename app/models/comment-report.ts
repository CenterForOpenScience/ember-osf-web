import { attr, belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';

import CommentModel from './comment';
import OsfModel from './osf-model';

export default class CommentReportModel extends OsfModel {
    @attr('fixstring') category!: string;

    @belongsTo('comment')
    text!: DS.PromiseObject<CommentModel> & CommentModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'comment-report': CommentReportModel;
    } // eslint-disable-line semi
}
