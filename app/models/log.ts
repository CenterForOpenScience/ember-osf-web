import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import NodeModel from './node';
import OsfModel from './osf-model';
import UserModel from './user';

export default class LogModel extends OsfModel {
    @attr('date') date!: Date;
    @attr('fixstring') action!: string;
    @attr('object') params!: any;

    @belongsTo('node', { inverse: null })
    node!: AsyncBelongsTo<NodeModel> & NodeModel;

    @belongsTo('node', { inverse: 'logs' })
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
