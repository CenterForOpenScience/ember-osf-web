import { belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';

import NodeModel from './node';
import OsfModel from './osf-model';

export default class NodeLinkModel extends OsfModel {
    @belongsTo('node')
    targetNode!: DS.PromiseObject<NodeModel> & NodeModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'node-link': NodeLinkModel;
    } // eslint-disable-line semi
}
