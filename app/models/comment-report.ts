import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr, belongsTo } = DS;

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
export default class CommentReport extends OsfModel.extend({
    category: attr('fixstring'),
    text: belongsTo('comment'),
}) {}

declare module 'ember-data' {
    interface ModelRegistry {
        'comment-report': CommentReport;
    }
}
