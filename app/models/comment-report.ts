import { attr, belongsTo } from '@ember-decorators/data';
import { ID } from 'ember-cli-mirage';
import DS from 'ember-data';
import Comment from 'ember-osf-web/models/comment';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 comment reports. Primarily accessed via relationship fields.
 *
 * @class CommentReport
 */
export default class CommentReport extends OsfModel {
    @attr('fixstring') reporter!: ID;
    @attr('fixstring') category!: string;
    @attr('fixstring') message!: string;

    @belongsTo('comment') comment!: DS.PromiseObject<Comment> & Comment;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'comment-report': CommentReport;
    }
}
