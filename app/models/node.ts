import { A } from '@ember/array';
import { bool, equal } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import DS from 'ember-data';
import FileItemMixin from 'ember-osf-web/mixins/file-item';
import { Promise as EmberPromise } from 'rsvp';
import Contributor from './contributor';
import OsfModel from './osf-model';

const { attr, belongsTo, hasMany } = DS;

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 nodes. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
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

    /**
     * Determine whether the specified user ID is a contributor on this node
     * @method contributorCheck
     * @param {String} userId
     * @return {Promise<boolean>} Whether the specified user is a contributor on this node
     */
    contributorCheck(userId: string): Promise<boolean> {
        // Return true if there is at least one matching contributor for this user ID
        if (!userId) {
            return new EmberPromise(resolve => resolve(false));
        }
        const contribId: string = `${this.get('id')}-${userId}`;
        return this.store.findRecord('contributor', contribId).then(() => true, () => false);
    },

    save(): Promise<Node> {
        // Some duplicate logic from osf-model#save needed to support
        // contributor edits being saved through the node
        // Note: order is important here so _dirtyRelationships gets set by the _super call
        const promise: Promise<Node> = this._super(...arguments);
        if (!this.get('_dirtyRelationships.contributors')) {
            this.set('_dirtyRelationships.contributors', {});
        }

        const contributors: typeof hasMany = this.hasMany('contributors').hasManyRelationship;
        this.set(
            '_dirtyRelationships.contributors.update',
            contributors.members.list
                .filter(m => !m.getRecord().get('isNew') && Object.keys(m.getRecord().changedAttributes()).length > 0),
        );
        // Need to included created contributors even in relationship
        // hasLoaded is false
        this.set(
            '_dirtyRelationships.contributors.create',
            contributors.members.list.filter(m => m.getRecord().get('isNew')),
        );
        // Contributors are a 'real' delete, not just a de-reference
        this.set(
            '_dirtyRelationships.contributors.delete',
            this.get('_dirtyRelationships.contributors.remove') || [],
        );
        this.set('_dirtyRelationships.contributors.remove', []);
        return promise;
    },

    addChild(title: string, description = null, category = 'project', isPublic: boolean): Promise<Node> {
        const child: Node = this.store.createRecord('node', {
            title,
            category,
            description,
            parent: this,
            public: isPublic,
        });

        return child.save();
    },

    addContributor(
        userId: string,
        permission: string,
        isBibliographic: boolean,
        sendEmail: boolean,
        fullName: string,
        email: string,
    ): Promise<Contributor> {
        const contrib: Contributor = this.store.createRecord('contributor', {
            permission,
            bibliographic: isBibliographic,
            sendEmail,
            nodeId: this.get('id'),
            userId,
            fullName,
            email,
        });

        return contrib.save();
    },

    async addContributors(contributors: Contributor[], sendEmail?: string): Promise<Contributor[]> {
        const payload: object[] = contributors.map(contrib => {
            const c = this.store.createRecord('contributor', {
                permission: contrib.permission,
                bibliographic: contrib.bibliographic,
                nodeId: this.get('id'),
                userId: contrib.userId,
                id: `${this.get('id')}-${contrib.userId}`,
                unregisteredContributor: null,
            });
            return c.serialize({
                includeId: true,
                includeUser: true,
            }).data;
        });

        let emailQuery: string = '';
        if (!sendEmail) {
            emailQuery = '?send_email=false';
        } else if (sendEmail === 'preprint') {
            emailQuery = '?send_email=preprint';
        }

        // TODO Get this working properly - should not be an ajax request in the future.
        const resp = await this.store.adapterFor('contributor')
            .ajax(this.get('links.relationships.contributors.links.related.href') + emailQuery, 'POST', {
                data: {
                    data: payload,
                },
                isBulk: true,
            });

        this.store.pushPayload(resp);
        const createdContribs = A();
        resp.data.map(contrib => createdContribs.push(this.store.peekRecord('contributor', contrib.id)));

        return createdContribs;
    },

    removeContributor(contributor: Contributor): Promise<null> {
        return contributor.destroyRecord();
    },

    updateContributor(contributor: Contributor, permissions: string, bibliographic: boolean) {
        if (!isEmpty(permissions)) { contributor.set('permission', permissions); }
        if (!isEmpty(bibliographic)) { contributor.set('bibliographic', bibliographic); }
        return contributor.save();
    },

    async updateContributors(
        contributors: Contributor[],
        permissionsChanges: object,
        bibliographicChanges: object,
    ): Promise<Contributor[]> {
        const payload: object[] = contributors
            .filter(contrib => contrib.id in permissionsChanges || contrib.id in bibliographicChanges)
            .map(contrib => {
                if (contrib.id in permissionsChanges) {
                    contrib.set('permission', permissionsChanges[contrib.id]);
                }

                if (contrib.id in bibliographicChanges) {
                    contrib.set('bibliographic', bibliographicChanges[contrib.id]);
                }

                return contrib.serialize({
                    includeId: true,
                    includeUser: false,
                }).data;
            });

        const resp = await this.store.adapterFor('contributor')
            .ajax(this.get('links.relationships.contributors.links.related.href'), 'PATCH', {
                data: {
                    data: payload,
                },
                isBulk: true,
            });

        this.store.pushPayload(resp);

        return contributors;
    },
    isNode: true,
}) {
}

declare module 'ember-data' {
    interface ModelRegistry {
        'node': Node;
    }
}
