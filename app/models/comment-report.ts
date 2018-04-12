import { attr, belongsTo } from '@ember-decorators/data';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 comment reports. Primarily accessed via relationship fields.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Comment_Reports_List_GET
 *
 * @class CommentReport
 */
export default class CommentReport extends OsfModel {
    @attr('fixstring') category;
    @belongsTo('comment') text;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'comment-report': CommentReport;
    }
}
