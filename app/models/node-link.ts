import { belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';

import NodeModel from './node';
import OsfModel from './osf-model';

/**
 * Model for OSF APIv2 node links. This model may refer to one of several API
 * endpoints. It may be queried directly, or accessed via relationship fields.
 */
export default class NodeLinkModel extends OsfModel {
    @belongsTo('node')
    targetNode!: DS.PromiseObject<NodeModel> & NodeModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'node-link': NodeLinkModel;
    } // eslint-disable-line semi
}
