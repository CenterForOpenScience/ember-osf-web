import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { alias, bool, equal } from '@ember-decorators/object/computed';
import { not } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';

import defaultTo from 'ember-osf-web/utils/default-to';
import getRelatedHref from 'ember-osf-web/utils/get-related-href';

import BaseFileItem from './base-file-item';
import CitationModel from './citation';
import CommentModel from './comment';
import ContributorModel from './contributor';
import DraftRegistrationModel from './draft-registration';
import FileProviderModel from './file-provider';
import IdentifierModel from './identifier';
import InstitutionModel from './institution';
import LicenseModel from './license';
import LogModel from './log';
import { Permission } from './osf-model';
import PreprintModel from './preprint';
import RegionModel from './region';
import RegistrationModel from './registration';
import WikiModel from './wiki';

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
            disabled: true,
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

export interface NodeLicense {
    readonly copyrightHolders?: string;
    readonly year?: string;
}

export default class NodeModel extends BaseFileItem.extend(Validations, CollectableValidations) {
    @attr('fixstring') title!: string;
    @attr('fixstring') description!: string;
    @attr('node-category') category!: string;
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
    @attr('fixstringarray') tags!: string[];
    @attr('fixstring') templateFrom!: string;
    @attr('string') analyticsKey?: string;
    @attr('boolean') preprint!: boolean;
    @attr('array') subjects!: string[];
    @attr('boolean') currentUserCanComment!: boolean;
    @attr('boolean') wikiEnabled!: boolean;

    @hasMany('contributor', { inverse: 'node' })
    contributors!: DS.PromiseManyArray<ContributorModel>;

    @hasMany('contributor', { inverse: null })
    bibliographicContributors!: DS.PromiseManyArray<ContributorModel>;

    @belongsTo('node', { inverse: 'children' })
    parent!: DS.PromiseObject<NodeModel> & NodeModel;

    @belongsTo('region')
    region!: RegionModel;

    @hasMany('node', { inverse: 'parent' })
    children!: DS.PromiseManyArray<NodeModel>;

    @hasMany('preprint', { inverse: 'node' })
    preprints!: DS.PromiseManyArray<PreprintModel>;

    @hasMany('institution', { inverse: 'nodes' })
    affiliatedInstitutions!: DS.PromiseManyArray<InstitutionModel> | InstitutionModel[];

    @hasMany('comment', { inverse: 'node' })
    comments!: DS.PromiseManyArray<CommentModel>;

    @belongsTo('citation')
    citation!: DS.PromiseObject<CitationModel> & CitationModel;

    @belongsTo('license', { inverse: null })
    license!: DS.PromiseObject<LicenseModel> & LicenseModel;

    @hasMany('file-provider', { inverse: 'node' })
    files!: DS.PromiseManyArray<FileProviderModel>;

    @hasMany('node', { inverse: null })
    linkedNodes!: DS.PromiseManyArray<NodeModel>;

    @hasMany('registration', { inverse: null })
    linkedRegistrations!: DS.PromiseManyArray<RegistrationModel>;

    @hasMany('registration', { inverse: 'registeredFrom' })
    registrations!: DS.PromiseManyArray<RegistrationModel>;

    @hasMany('draft-registration', { inverse: 'branchedFrom' })
    draftRegistrations!: DS.PromiseManyArray<DraftRegistrationModel>;

    @hasMany('node', { inverse: 'forkedFrom' })
    forks!: DS.PromiseManyArray<NodeModel>;

    @belongsTo('node', { inverse: 'forks', polymorphic: true })
    forkedFrom!: (DS.PromiseObject<NodeModel> & NodeModel) |
        (DS.PromiseObject<RegistrationModel> & RegistrationModel);

    @belongsTo('node', { inverse: null })
    root!: DS.PromiseObject<NodeModel> & NodeModel;

    @hasMany('node', { inverse: null })
    linkedByNodes!: DS.PromiseManyArray<NodeModel>;

    @hasMany('node', { inverse: null })
    linkedByRegistrations!: DS.PromiseManyArray<RegistrationModel>;

    @hasMany('wiki', { inverse: 'node' })
    wikis!: DS.PromiseManyArray<WikiModel>;

    @hasMany('log', { inverse: 'originalNode' })
    logs!: DS.PromiseManyArray<LogModel>;

    @hasMany('identifier', { inverse: null })
    identifiers!: DS.PromiseManyArray<IdentifierModel>;

    // These are only computeds because maintaining separate flag values on
    // different classes would be a headache TODO: Improve.

    /**
     * Is this a project? Flag can be used to provide template-specific behavior
     * for different resource types.
     */
    @equal('constructor.modelName', 'node') isProject!: boolean;

    /**
     * Is this a registration? Flag can be used to provide template-specific
     * behavior for different resource types.
     */
    @equal('constructor.modelName', 'registration') isRegistration!: boolean;

    /**
     * Is this node being viewed through an anonymized, view-only link?
     */
    @bool('apiMeta.anonymous') isAnonymous!: boolean;

    /**
     * Does the current user have write permission on this node?
     */
    @computed('currentUserPermissions')
    get userHasWritePermission() {
        return Array.isArray(this.currentUserPermissions) && this.currentUserPermissions.includes(Permission.Write);
    }

    /**
     * Is the current user an admin on this node?
     */
    @computed('currentUserPermissions')
    get userHasAdminPermission() {
        return Array.isArray(this.currentUserPermissions) && this.currentUserPermissions.includes(Permission.Admin);
    }

    /**
     * Does the current user have read permission on this node?
     */
    @computed('currentUserPermissions')
    get userHasReadPermission() {
        return Array.isArray(this.currentUserPermissions) && this.currentUserPermissions.includes(Permission.Read);
    }

    /**
     * The type of this node.
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

    // This is for the title helper, which does its own encoding of unsafe characters
    @computed('title')
    get unsafeTitle() {
        return htmlSafe(this.title);
    }

    @computed('root')
    get isRoot() {
        const rootId = (this as NodeModel).belongsTo('root').id();
        return !rootId || rootId === this.id;
    }

    // BaseFileItem override
    isNode = true;
    collectable: boolean = defaultTo(this.collectable, false);

    makeFork(): Promise<object> {
        const url = getRelatedHref(this.links.relationships!.forks);
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
    setNodeLicenseDefaults(requiredFields: Array<keyof NodeLicense>): void {
        if (!requiredFields.length && this.nodeLicense) {
            // If the nodeLicense exists, notify property change so that validation is triggered
            this.notifyPropertyChange('nodeLicense');

            return;
        }

        const {
            copyrightHolders = '',
            year = new Date().getUTCFullYear().toString(),
        } = (this.nodeLicense || {});

        const nodeLicenseDefaults: NodeLicense = {
            copyrightHolders,
            year,
        };

        // Only set the required fields on nodeLicense
        const props = requiredFields.reduce(
            (acc, val) => ({ ...acc, [val]: nodeLicenseDefaults[val] }),
            {},
        );

        this.set('nodeLicense', props);
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        node: NodeModel;
    } // eslint-disable-line semi
}
