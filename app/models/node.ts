import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import { bool, equal } from '@ember-decorators/object/computed';
import { buildValidations, validator } from 'ember-cp-validations';
import FileItemMixin from 'ember-osf-web/mixins/file-item';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

const Validations = buildValidations({
    title: [
        validator('presence', true),
    ],
});

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
export default class Node extends OsfModel.extend(Validations, FileItemMixin) {
    @attr('fixstring') title;
    @attr('fixstring') description;
    @attr('fixstring') category;

    // List of strings
    @attr('array') currentUserPermissions;
    @attr('boolean') currentUserIsContributor;

    @attr('boolean') fork;
    @attr('boolean') collection;
    @attr('boolean') registration;
    @attr('boolean') public;

    @attr('date') dateCreated;
    @attr('date') dateModified;

    @attr('date') forkedDate;

    @attr('object') nodeLicense;
    @attr('array') tags;

    @attr('fixstring') templateFrom;

    @belongsTo('node', { inverse: 'children' }) parent; // eslint-disable-line no-restricted-globals
    @hasMany('node', { inverse: 'parent' }) children;
    @hasMany('preprint', { inverse: 'node' }) preprints;
    @hasMany('institution', { inverse: 'nodes' }) affiliatedInstitutions;
    @hasMany('comment') comments;
    @hasMany('contributor', { allowBulkUpdate: true, allowBulkRemove: true, inverse: 'node' }) contributors;
    @belongsTo('citation') citation;

    @belongsTo('license', { inverse: null }) license;

    @hasMany('file-provider') files;

    @hasMany('node', { inverse: null, serializerType: 'linked-node' }) linkedNodes;
    @hasMany('registration', { inverse: 'registeredFrom' }) registrations;

    @hasMany('draft-registration', { inverse: 'branchedFrom' }) draftRegistrations;

    @hasMany('node', { inverse: 'forkedFrom' }) forks;

    @belongsTo('node', { inverse: 'forks' }) forkedFrom;

    @belongsTo('node', { inverse: null }) root;

    @hasMany('wiki', { inverse: 'node' }) wikis;

    @hasMany('log') logs;

    // These are only computeds because maintaining separate flag values on different classes would be a
    // headache TODO: Improve.
    /**
     * Is this a project? Flag can be used to provide template-specific behavior for different resource types.
     * @property isProject
     * @type boolean
     */
    @equal('constructor.modelName', 'node') isProject;

    /**
     * Is this a registration? Flag can be used to provide template-specific behavior for different resource types.
     * @property isRegistration
     * @type boolean
     */
    @equal('constructor.modelName', 'registration') isRegistration;

    /**
     * Is this node being viewed through an anonymized, view-only link?
     * @property isAnonymous
     * @type boolean
     */
    @bool('meta.anonymous') isAnonymous;

    isNode = true;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'node': Node;
    }
}
