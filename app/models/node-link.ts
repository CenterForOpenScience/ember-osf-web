import { belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';
import Node from './node';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 node links. This model may refer to one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 *
 * @class NodeLink
 */
export default class NodeLink extends OsfModel {
    @belongsTo('node') targetNode!: DS.PromiseObject<Node> & Node;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'node-link': NodeLink;
    } // eslint-disable-line semi
}
