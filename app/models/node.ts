import { bool, equal } from '@ember/object/computed';
import DS from 'ember-data';
import FileItemMixin from 'ember-osf-web/mixins/file-item';
import OsfModel from './osf-model';

const { attr, belongsTo, hasMany } = DS;

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 nodes. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 *
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Node_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_Children_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Linked_Nodes_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_Forks_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/User_Nodes_GET
 * @class Node
 */
export default class Node extends OsfModel.extend(FileItemMixin, {
    title: attr('fixstring'),
    description: attr('fixstring'),
    category: attr('fixstring'),

    // List of strings
    currentUserPermissions: attr('array'),

    fork: attr('boolean'),
    collection: attr('boolean'),
    registration: attr('boolean'),
    public: attr('boolean'),

    dateCreated: attr('date'),
    dateModified: attr('date'),

    forkedDate: attr('date'),

    nodeLicense: attr('object'),
    tags: attr('array'),

    templateFrom: attr('fixstring'),

    parent: belongsTo('node', {
        inverse: 'children',
    }),
    children: hasMany('node', {
        inverse: 'parent',
    }),
    preprints: hasMany('preprint', {
        inverse: 'node',
    }),
    affiliatedInstitutions: hasMany('institution', {
        inverse: 'nodes',
    }),
    comments: hasMany('comment'),
    contributors: hasMany('contributor', {
        allowBulkUpdate: true,
        allowBulkRemove: true,
        inverse: 'node',
    }),
    citation: belongsTo('citation'),

    license: belongsTo('license', {
        inverse: null,
    }),

    files: hasMany('file-provider'),
    // forkedFrom: belongsTo('node'),
    linkedNodes: hasMany('node', {
        inverse: null,
        serializerType: 'linked-node',
    }),
    registrations: hasMany('registration', {
        inverse: 'registeredFrom',
    }),

    draftRegistrations: hasMany('draft-registration', {
        inverse: 'branchedFrom',
    }),

    forks: hasMany('node', {
        inverse: 'forkedFrom',
    }),

    forkedFrom: belongsTo('node', {
        inverse: 'forks',
    }),

    root: belongsTo('node', {
        inverse: null,
    }),

    wikis: hasMany('wiki', {
        inverse: 'node',
    }),

    logs: hasMany('log'),

    // These are only computeds because maintaining separate flag values on different classes would be a
    // headache TODO: Improve.
    /**
     * Is this a project? Flag can be used to provide template-specific behavior for different resource types.
     * @property isProject
     * @type boolean
     */
    isProject: equal('constructor.modelName', 'node'),
    /**
     * Is this a registration? Flag can be used to provide template-specific behavior for different resource types.
     * @property isRegistration
     * @type boolean
     */
    isRegistration: equal('constructor.modelName', 'registration'),

    /**
     * Is this node being viewed through an anonymized, view-only link?
     * @property isAnonymous
     * @type boolean
     */
    isAnonymous: bool('meta.anonymous'),

    isNode: true,
}) {}

declare module 'ember-data' {
    interface ModelRegistry {
        'node': Node;
    }
}
