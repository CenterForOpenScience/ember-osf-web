import { attr, belongsTo } from '@ember-decorators/data';
import { ID } from 'ember-cli-mirage';
import DS from 'ember-data';

import CommentModel from './comment';
import OsfModel from './osf-model';

/**
 * Model for OSF APIv2 comment reports. Primarily accessed via relationship fields.
 *
 * @class CommentReport
 */
export default class CommentReportModel extends OsfModel {
    @attr('fixstring') reporter!: ID;
    @attr('fixstring') category!: string;
    @attr('fixstring') message!: string;

    @belongsTo('comment') comment!: DS.PromiseObject<CommentModel> & CommentModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'comment-report': CommentReportModel;
    } // eslint-disable-line semi
}
