import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import DS from 'ember-data';
import CommentReportModel from './comment-report';
import NodeModel from './node';
import OsfModel from './osf-model';
import UserModel from './user';

export default class CommentModel extends OsfModel {
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
    @attr('boolean') isHam!: boolean;
    @attr('boolean') hasReport!: boolean;
    @attr('boolean') hasChildren!: boolean;
    @attr('boolean') canEdit!: boolean;

    // TODO dynamic belongsTo
    @belongsTo('user')
    user!: DS.PromiseObject<UserModel> & UserModel;

    @belongsTo('node', { inverse: 'comments', polymorphic: true })
    node!: DS.PromiseObject<NodeModel> & NodeModel;

    @hasMany('comment', { inverse: null })
    replies!: DS.PromiseManyArray<CommentModel>;

    @hasMany('comment-report', { inverse: 'comment' })
    reports!: DS.PromiseManyArray<CommentReportModel>;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        comment: CommentModel;
    } // eslint-disable-line semi
}
