import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr, belongsTo, hasMany } = DS;

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 comments. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Comment_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_Comments_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_Comments_List_GET
 *
 * @class Comment
 */
export default class Comment extends OsfModel.extend({
    // TODO validation: maxLength
    content: attr('fixstring'),
    page: attr('fixstring'),

    // Placeholder for comment creation: allow specifying attributes that are sent to the server, but not as attributes
    // Both type and ID will be serialized into relationships field
    targetID: attr('fixstring'),
    targetType: attr('fixstring'),

    dateCreated: attr('date'),
    dateModified: attr('date'),
    modified: attr('boolean'),
    deleted: attr('boolean'),
    isAbuse: attr('boolean'),
    hasChildren: attr('boolean'),
    canEdit: attr('boolean'),

    // TODO dynamic belongsTo
    user: belongsTo('user'),
    node: belongsTo('node'),
    replies: hasMany('comment', {
        inverse: null,
    }),
}) {}

declare module 'ember-data' {
    interface ModelRegistry {
        'comment': Comment;
    }
}
