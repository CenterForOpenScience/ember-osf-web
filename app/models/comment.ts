import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import DS from 'ember-data';
import Node from './node';
import OsfModel from './osf-model';
import User from './user';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 comments. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 *
 * @class Comment
 */
export default class Comment extends OsfModel {
    // TODO validation: maxLength
    @attr('fixstring') content!: string;
    @attr('fixstring') page!: string;

    // Placeholder for comment creation: allow specifying attributes that are sent to the server, but not as attributes
    // Both type and ID will be serialized into relationships field
    @attr('fixstring') targetID!: string;
    @attr('fixstring') targetType!: string;

    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;
    @attr('boolean') modified!: boolean;
    @attr('boolean') deleted!: boolean;
    @attr('boolean') isAbuse!: boolean;
    @attr('boolean') hasChildren!: boolean;
    @attr('boolean') canEdit!: boolean;

    // TODO dynamic belongsTo
    @belongsTo('user') user!: DS.PromiseObject<User> & User;
    @belongsTo('node', { inverse: 'comments', polymorphic: true }) node!: DS.PromiseObject<Node> & Node;

    @hasMany('comment', { inverse: null })
    replies!: DS.PromiseManyArray<Comment>;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        comment: Comment;
    } // eslint-disable-line semi
}
