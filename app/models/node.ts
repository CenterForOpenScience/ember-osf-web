import { attr, belongsTo, hasMany, AsyncBelongsTo, AsyncHasMany } from '@ember-data/model';

import { computed } from '@ember/object';
import { alias, bool, equal, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';
import { buildValidations, validator } from 'ember-cp-validations';
import Intl from 'ember-intl/services/intl';

import config from 'ember-osf-web/config/environment';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';

import getRelatedHref from 'ember-osf-web/utils/get-related-href';
import captureException from 'ember-osf-web/utils/capture-exception';

import AbstractNodeModel from 'ember-osf-web/models/abstract-node';
import CitationModel from './citation';
import CommentModel from './comment';
import ContributorModel from './contributor';
import IdentifierModel from './identifier';
import InstitutionModel from './institution';
import LicenseModel from './license';
import LogModel from './log';
import NodeStorageModel from './node-storage';
import { Permission } from './osf-model';
import PreprintModel from './preprint';
import RegionModel from './region';
import RegistrationModel from './registration';
import SubjectModel from './subject';
import WikiModel from './wiki';

const {
    OSF: {
        apiUrl,
        apiNamespace,
    },
} = config;

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

export enum NodeCategory {
    Data = 'data',
    Other = 'other',
    Project = 'project',
    Software = 'software',
    Analysis = 'analysis',
    Procedure = 'procedure',
    Hypothesis = 'hypothesis',
    Uncategorized = 'uncategorized',
    Communication = 'communication',
    Instrumentation = 'instrumentation',
    MethodsAndMeasures = 'methods and measures',
}

export interface NodeLicense {
    readonly copyrightHolders?: string;
    readonly year?: string;
}

export default class NodeModel extends AbstractNodeModel.extend(Validations, CollectableValidations) {
    @service intl!: Intl;

    @attr('fixstring') title!: string;
    @attr('fixstring') description!: string;
    @attr('node-category') category!: NodeCategory;
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
    @attr('boolean') currentUserCanComment!: boolean;
    @attr('boolean') wikiEnabled!: boolean;

    @hasMany('subject', { inverse: null, async: false }) subjectsAcceptable?: SubjectModel[];

    // FE-only property to check enabled addons.
    // null until getEnabledAddons has been called
    @tracked addonsEnabled?: string[];

    @hasMany('contributor', { inverse: 'node' })
    contributors!: AsyncHasMany<ContributorModel> & ContributorModel[];

    @hasMany('contributor', { inverse: null })
    bibliographicContributors!: AsyncHasMany<ContributorModel>;

    @belongsTo('node', { inverse: 'children' })
    parent!: AsyncBelongsTo<NodeModel> & NodeModel;

    @belongsTo('region')
    region!: RegionModel;

    @hasMany('node', { inverse: 'parent' })
    children!: AsyncHasMany<NodeModel>;

    @hasMany('preprint', { inverse: 'node' })
    preprints!: AsyncHasMany<PreprintModel>;

    @hasMany('institution', { inverse: 'nodes' })
    affiliatedInstitutions!: AsyncHasMany<InstitutionModel> | InstitutionModel[];

    @hasMany('comment', { inverse: 'node' })
    comments!: AsyncHasMany<CommentModel>;

    @belongsTo('citation')
    citation!: AsyncBelongsTo<CitationModel> & CitationModel;

    @belongsTo('license', { inverse: null })
    license!: AsyncBelongsTo<LicenseModel> & LicenseModel;

    @hasMany('node', { inverse: null })
    linkedNodes!: AsyncHasMany<NodeModel> & NodeModel[];

    @hasMany('registration', { inverse: null })
    linkedRegistrations!: AsyncHasMany<RegistrationModel>;

    @hasMany('registration', { inverse: 'registeredFrom' })
    registrations!: AsyncHasMany<RegistrationModel>;

    @hasMany('node', { inverse: 'forkedFrom', polymorphic: true })
    forks!: AsyncHasMany<NodeModel>;

    @belongsTo('node', { inverse: 'forks', polymorphic: true })
    forkedFrom!: (AsyncBelongsTo<NodeModel> & NodeModel) | (AsyncBelongsTo<RegistrationModel> & RegistrationModel);

    @belongsTo('node', { inverse: null })
    root!: AsyncBelongsTo<NodeModel> & NodeModel;

    @belongsTo('node-storage', { inverse: null })
    storage!: AsyncBelongsTo<NodeStorageModel> & NodeStorageModel;

    @hasMany('node', { inverse: null })
    linkedByNodes!: AsyncHasMany<NodeModel>;

    @hasMany('node', { inverse: null })
    linkedByRegistrations!: AsyncHasMany<RegistrationModel>;

    @hasMany('wiki', { inverse: 'node' })
    wikis!: AsyncHasMany<WikiModel>;

    @hasMany('log', { inverse: 'originalNode' })
    logs!: AsyncHasMany<LogModel>;

    @hasMany('identifier', { inverse: 'referent' })
    identifiers!: AsyncHasMany<IdentifierModel>;

    @hasMany('subject', { inverse: null, async: false })
    subjects!: SubjectModel[];

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

    @computed('currentUserPermissions.length')
    get currentUserIsReadOnly() {
        return Array.isArray(this.currentUserPermissions) && this.currentUserPermissions.includes(Permission.Read)
            && this.currentUserPermissions.length === 1;
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

    /**
     * The type of this node, as a string.
     */
    get nodeTypeTranslation(): string {
        let translationNode = this.isRoot ? 'project' : 'component';
        if (this.isRegistration) {
            translationNode = 'registration';
        }
        return this.intl.t(`general.${translationNode}`);
    }

    // This is for the title helper, which does its own encoding of unsafe characters
    @computed('title')
    get unsafeTitle() {
        return htmlSafe(this.title);
    }

    @computed('id', 'root')
    get isRoot() {
        const rootId = (this as NodeModel).belongsTo('root').id();
        return !rootId || rootId === this.id;
    }

    // BaseFileItem override
    isNode = true;
    collectable = false;

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

    @task
    @waitFor
    async getEnabledAddons() {
        try {
            const endpoint = `${apiUrl}/${apiNamespace}/nodes/${this.id}/addons/`;
            const response = await this.currentUser.authenticatedAJAX({
                url: endpoint,
                type: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                xhrFields: { withCredentials: true },
            });
            if (response.data) {
                const addonList = response.data
                    .filter((addon: any) => addon.attributes.node_has_auth)
                    .map((addon: any) => addon.id);
                this.set('addonsEnabled', addonList);
            }
        } catch (e) {
            captureException(e);
        }
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        node: NodeModel;
    } // eslint-disable-line semi
}
