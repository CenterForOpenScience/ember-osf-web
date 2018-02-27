import DS from 'ember-data';
import OsfModel from './osf-model';
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
    content: DS.attr('fixstring'),
    page: DS.attr('fixstring'),

    // Placeholder for comment creation: allow specifying attributes that are sent to the server, but not as attributes
    // Both type and ID will be serialized into relationships field
    targetID: DS.attr('fixstring'),
    targetType: DS.attr('fixstring'),

    dateCreated: DS.attr('date'),
    dateModified: DS.attr('date'),
    modified: DS.attr('boolean'),
    deleted: DS.attr('boolean'),
    isAbuse: DS.attr('boolean'),
    hasChildren: DS.attr('boolean'),
    canEdit: DS.attr('boolean'),

    // TODO dynamic belongsTo
    user: DS.belongsTo('user'),
    node: DS.belongsTo('node'),
    replies: DS.hasMany('comment', {
        inverse: null,
    }),
}) {
  // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data' {
    interface ModelRegistry {
        'comment': Comment;
    }
}
