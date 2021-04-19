import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import NodeModel from './node';
import OsfModel from './osf-model';
import UserModel from './user';

export default class LogModel extends OsfModel {
    @attr('date') date!: Date;
    @attr('fixstring') action!: string;
    @attr('object') params!: any;

    @belongsTo('node', { inverse: null })
    node!: AsyncBelongsTo<NodeModel>;

    @belongsTo('node', { inverse: 'logs' })
    originalNode!: AsyncBelongsTo<NodeModel>;

    @belongsTo('user')
    user!: AsyncBelongsTo<UserModel>;

    @belongsTo('node', { inverse: null })
    linkedNode!: AsyncBelongsTo<NodeModel>;

    @belongsTo('node', { inverse: null })
    templateNode!: AsyncBelongsTo<NodeModel>;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        log: LogModel;
    } // eslint-disable-line semi
}
