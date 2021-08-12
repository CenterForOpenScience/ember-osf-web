import { belongsTo, AsyncBelongsTo } from '@ember-data/model';

import NodeModel from './node';
import OsfModel from './osf-model';

export default class NodeLinkModel extends OsfModel {
    @belongsTo('node')
    targetNode!: AsyncBelongsTo<NodeModel> & NodeModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'node-link': NodeLinkModel;
    } // eslint-disable-line semi
}
