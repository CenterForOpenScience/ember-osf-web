import { attr, belongsTo, hasMany } from '@ember-decorators/data';
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
export default class Comment extends OsfModel {
    // TODO validation: maxLength
    @attr('fixstring') content;
    @attr('fixstring') page;

    // Placeholder for comment creation: allow specifying attributes that are sent to the server, but not as attributes
    // Both type and ID will be serialized into relationships field
    @attr('fixstring') targetID;
    @attr('fixstring') targetType;

    @attr('date') dateCreated;
    @attr('date') dateModified;
    @attr('boolean') modified;
    @attr('boolean') deleted;
    @attr('boolean') isAbuse;
    @attr('boolean') hasChildren;
    @attr('boolean') canEdit;

    // TODO dynamic belongsTo
    @belongsTo('user') user;
    @belongsTo('node') node;

    @hasMany('comment', { inverse: null })
    replies;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'comment': Comment;
    }
}
