import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { alias, bool, equal } from '@ember-decorators/object/computed';
import EmberObject from '@ember/object';
import { not } from '@ember/object/computed';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';
import { Deserialized as NodeLicense } from 'ember-osf-web/transforms/node-license';
import defaultTo from 'ember-osf-web/utils/default-to';
import BaseFileItem from './base-file-item';
import Citation from './citation';
import Comment from './comment';
import Contributor from './contributor';
import DraftRegistration from './draft-registration';
import FileProvider from './file-provider';
import Institution from './institution';
import License from './license';
import Log from './log';
import { Permission } from './osf-model';
import Preprint from './preprint';
import Region from './region';
import Registration from './registration';
import Wiki from './wiki';

const Validations = buildValidations({
    title: [
        validator('presence', true),
    ],
});

const CollectableValidations = buildValidations({
    description: [
        validator('presence', {
            presence: true,
        }),
    ],
    license: [
        validator('presence', {
            presence: true,
        }),
    ],
    nodeLicense: [
        validator('presence', {
            presence: true,
        }),
        validator('node-license', {
            on: 'license',
        }),
    ],
    tags: [
        validator('presence', {
            presence: true,
        }),
    ],
}, {
    disabled: not('model.collectable'),
});

export enum NodeType {
    Fork = 'fork',
    Generic = 'generic',
    Registration = 'registration',
}

/**
 * Model for OSF APIv2 nodes. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 *
 * @class Node
 */
export default class Node extends BaseFileItem.extend(Validations, CollectableValidations) {
    @attr('fixstring') title!: string;
    @attr('fixstring') description!: string;
    @attr('fixstring') category!: string;

    @attr('array') currentUserPermissions!: Permission[];
    @attr('boolean') currentUserIsContributor!: boolean;

    @attr('boolean') fork!: boolean;
    @alias('fork') isFork!: boolean;
    @attr('boolean') collection!: boolean;
    @attr('boolean') registration!: boolean;
    @attr('boolean') public!: boolean;

    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;

    @attr('date') forkedDate!: Date;

    @attr('node-license') nodeLicense!: NodeLicense | null;
    @attr('array') tags!: string[];

    @attr('fixstring') templateFrom!: string;

    @attr('string') analyticsKey?: string;

    @hasMany('contributor', { inverse: 'node' })
    contributors!: DS.PromiseManyArray<Contributor>;

    @belongsTo('node', { inverse: 'children' })
    parent!: DS.PromiseObject<Node> & Node; // eslint-disable-line no-restricted-globals

    @belongsTo('region') region!: Region;

    @hasMany('node', { inverse: 'parent' }) children!: DS.PromiseManyArray<Node>;
    @hasMany('preprint', { inverse: 'node' }) preprints!: DS.PromiseManyArray<Preprint>;
    @hasMany('institution', { inverse: 'nodes' })
    affiliatedInstitutions!: DS.PromiseManyArray<Institution> | Institution[];
    @hasMany('comment', { inverse: 'node' }) comments!: DS.PromiseManyArray<Comment>;
    @belongsTo('citation') citation!: DS.PromiseObject<Citation> & Citation;

    @belongsTo('license', { inverse: null }) license!: DS.PromiseObject<License> & License;

    @hasMany('file-provider', { inverse: 'node' }) files!: DS.PromiseManyArray<FileProvider>;

    @hasMany('node', { inverse: null }) linkedNodes!: DS.PromiseManyArray<Node>;
    @hasMany('registration', { inverse: 'registeredFrom' }) registrations!: DS.PromiseManyArray<Registration>;

    @hasMany('draft-registration', { inverse: 'branchedFrom' })
    draftRegistrations!: DS.PromiseManyArray<DraftRegistration>;

    @hasMany('node', { inverse: 'forkedFrom' }) forks!: DS.PromiseManyArray<Node>;

    @belongsTo('node', { inverse: 'forks' }) forkedFrom!: DS.PromiseObject<Node> & Node;

    @belongsTo('node', { inverse: null }) root!: DS.PromiseObject<Node> & Node;

    @hasMany('node', { inverse: null }) linkedByNodes!: DS.PromiseManyArray<Node>;

    @hasMany('node', { inverse: null }) linkedByRegistrations!: DS.PromiseManyArray<Node>;

    @hasMany('wiki', { inverse: 'node' }) wikis!: DS.PromiseManyArray<Wiki>;

    @hasMany('log', { inverse: 'originalNode' }) logs!: DS.PromiseManyArray<Log>;

    // These are only computeds because maintaining separate flag values on different classes would be a
    // headache TODO: Improve.
    /**
     * Is this a project? Flag can be used to provide template-specific behavior for different resource types.
     * @property isProject
     * @type boolean
     */
    @equal('constructor.modelName', 'node') isProject!: boolean;

    /**
     * Is this a registration? Flag can be used to provide template-specific behavior for different resource types.
     * @property isRegistration
     * @type boolean
     */
    @equal('constructor.modelName', 'registration') isRegistration!: boolean;

    /**
     * Is this node being viewed through an anonymized, view-only link?
     * @property isAnonymous
     * @type boolean
     */
    @bool('meta.anonymous') isAnonymous!: boolean;

    /**
     * Does the current user have write permission on this node?
     * @property currentUserCanEdit
     * @type boolean
     */
    @computed('currentUserPermissions')
    get currentUserCanEdit() {
        return Array.isArray(this.currentUserPermissions) && this.currentUserPermissions.includes(Permission.Write);
    }

    /**
     * Is the current user an admin on this node?
     * @property currentUserIsAdmin
     * @type boolean
     */
    @computed('currentUserPermissions')
    get currentUserIsAdmin() {
        return Array.isArray(this.currentUserPermissions) && this.currentUserPermissions.includes(Permission.Admin);
    }

    /**
     * The type of this node.
     * @property nodeType
     * @type NodeType
     */
    @computed('isFork', 'isRegistration')
    get nodeType(): NodeType {
        if (this.isRegistration) {
            return NodeType.Registration;
        }
        if (this.isFork) {
            return NodeType.Fork;
        }
        return NodeType.Generic;
    }

    // BaseFileItem override
    isNode = true;
    collectable: boolean = defaultTo(this.collectable, false);

    makeFork(this: Node): Promise<object> {
        const url = this.get('links').relationships.forks.links.related.href;
        return this.currentUser.authenticatedAJAX({
            url,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                data: { type: 'nodes' },
            }),
        });
    }

    /**
     * Sets the nodeLicense field defaults based on required fields from a License
     */
    setNodeLicenseDefaults(this: Node, requiredFields: Array<keyof NodeLicense>): void {
        if (!requiredFields.length && this.nodeLicense) {
            // If the nodeLicense exists, notify property change so that validation is triggered
            this.notifyPropertyChange('nodeLicense');

            return;
        }

        const {
            copyrightHolders = '',
            year = new Date().getUTCFullYear().toString(),
        } = (this.nodeLicense || {});

        const nodeLicenseDefaults: NodeLicense = EmberObject.create({
            copyrightHolders,
            year,
        });

        // Only set the required fields on nodeLicense
        const props = requiredFields.reduce(
            (acc, val) => ({ ...acc, [val]: nodeLicenseDefaults[val] }),
            {},
        );

        this.set('nodeLicense', EmberObject.create(props));
    }
}

declare module 'ember-data' {
    interface ModelRegistry {
        node: Node;
    }
}
