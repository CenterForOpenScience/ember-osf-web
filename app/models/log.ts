import { attr, belongsTo, AsyncBelongsTo } from '@ember-data/model';
import { Link } from 'jsonapi-typescript';

import NodeModel from './node';
import OsfModel from './osf-model';
import UserModel, { UserLinks } from './user';

export interface LogParamNodeModel {
    id: string;
    title: string;
}

export interface LogParamUrls {
    view: Link;
    download: Link;
}

export interface LogParamModel {
    contributors: string[];
    comment_location: string;
    // @attr('object', {snakifyForApi: true}) operationResult!: OperationResult;
    params_node: LogParamNodeModel;
    params_project: string;
    pointer: string;
    preprint_provider: string;
    urls: UserLinks;
}

export default class LogModel extends OsfModel {
    @attr('date') date!: Date;
    @attr('fixstring') action!: string;
    @attr('object') params!: LogParamModel;

    @belongsTo('node', { inverse: null })
    node!: AsyncBelongsTo<NodeModel> & NodeModel;

    @belongsTo('node', { polymorphic: true, inverse: 'logs' })
    originalNode!: AsyncBelongsTo<NodeModel> & NodeModel;

    @belongsTo('user')
    user!: AsyncBelongsTo<UserModel> & UserModel;

    @belongsTo('node', { inverse: null })
    linkedNode!: AsyncBelongsTo<NodeModel> & NodeModel;

    @belongsTo('node', { inverse: null })
    templateNode!: AsyncBelongsTo<NodeModel> & NodeModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        log: LogModel;
    } // eslint-disable-line semi
}
