import { belongsTo } from '@ember-decorators/data';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 node links. This model may refer to one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Node_Links_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_Links_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_Node_Links_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_Node_Links_Detail_GET
 * @class NodeLink
 */
export default class NodeLink extends OsfModel {
    @belongsTo('node') targetNode;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'node-link': NodeLink;
    }
}
