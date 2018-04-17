import { attr, belongsTo } from '@ember-decorators/data';
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
    @attr('fixstring') category: string;
    @belongsTo('comment') text: Comment;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'comment-report': CommentReport;
    }
}
