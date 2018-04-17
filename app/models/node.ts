import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import { bool, equal } from '@ember-decorators/object/computed';
import { buildValidations, validator } from 'ember-cp-validations';
import FileItemMixin from 'ember-osf-web/mixins/file-item';
import Citation from './citation';
import Comment from './comment';
import Contributor from './contributor';
import DraftRegistration from './draft-registration';
import FileProvider from './file-provider';
import Institution from './institution';
import License from './license';
import Log from './log';
import OsfModel from './osf-model';
import Preprint from './preprint';
import Registration from './registration';
import Wiki from './wiki';

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
 * @class Node
 */
export default class Node extends OsfModel.extend(Validations, FileItemMixin) {
    @attr('fixstring') title: string;
    @attr('fixstring') description: string;
    @attr('fixstring') category: string;

    @attr('array') currentUserPermissions: string[];
    @attr('boolean') currentUserIsContributor: boolean;

    @attr('boolean') fork: boolean;
    @attr('boolean') collection: boolean;
    @attr('boolean') registration: boolean;
    @attr('boolean') public: boolean;

    @attr('date') dateCreated: Date;
    @attr('date') dateModified: Date;

    @attr('date') forkedDate: Date;

    @attr('object') nodeLicense: any;
    @attr('array') tags: string[];

    @attr('fixstring') templateFrom: string;

    @hasMany('contributor', { allowBulkUpdate: true, allowBulkRemove: true, inverse: 'node' })
    contributors: Contributor[];

    @belongsTo('node', { inverse: 'children' }) parent: Node; // eslint-disable-line no-restricted-globals
    @hasMany('node', { inverse: 'parent' }) children: Node[];
    @hasMany('preprint', { inverse: 'node' }) preprints: Preprint[];
    @hasMany('institution', { inverse: 'nodes' }) affiliatedInstitutions: Institution[];
    @hasMany('comment') comments: Comment[];
    @belongsTo('citation') citation: Citation;

    @belongsTo('license', { inverse: null }) license: License;

    @hasMany('file-provider') files: FileProvider;

    @hasMany('node', { inverse: null, serializerType: 'linked-node' }) linkedNodes: Node[];
    @hasMany('registration', { inverse: 'registeredFrom' }) registrations: Registration[];

    @hasMany('draft-registration', { inverse: 'branchedFrom' }) draftRegistrations: DraftRegistration[];

    @hasMany('node', { inverse: 'forkedFrom' }) forks: Node[];

    @belongsTo('node', { inverse: 'forks' }) forkedFrom: Node;

    @belongsTo('node', { inverse: null }) root: Node;

    @hasMany('wiki', { inverse: 'node' }) wikis: Wiki[];

    @hasMany('log') logs: Log[];

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
