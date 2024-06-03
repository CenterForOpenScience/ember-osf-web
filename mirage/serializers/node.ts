import { ID, ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';
import Node from 'ember-osf-web/models/registration';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export interface NodeAttrs {
    parentId: ID | null;
    rootId: ID | null;
    licenseId: ID | null;
    _anonymized: boolean;
    fileProviderId: ID | null;
}

type MirageNode = Node & { attrs: NodeAttrs };

export default class NodeSerializer extends ApplicationSerializer<MirageNode> {
    buildRelationships(model: ModelInstance<MirageNode>) {
        const relationships: SerializedRelationships<Node> = {
            linkedNodes: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/linked_nodes/`,
                        meta: this.buildRelatedLinkMeta(model, 'linkedNodes'),
                    },
                    self: {
                        href: `${apiUrl}/v2/nodes/${model.id}/relationships/linked_nodes/`,
                        meta: {},
                    },
                },
            },
            linkedByNodes: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/linked_by_nodes/`,
                        meta: this.buildRelatedLinkMeta(model, 'linkedByNodes'),
                    },
                },
            },
            linkedRegistrations: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/linked_registrations/`,
                        meta: this.buildRelatedLinkMeta(model, 'linkedRegistrations'),
                    },
                    self: {
                        href: `${apiUrl}/v2/nodes/${model.id}/relationships/linked_registrations/`,
                        meta: {},
                    },
                },
            },
            bibliographicContributors: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/bibliographic_contributors/`,
                        meta: this.buildRelatedLinkMeta(model, 'bibliographicContributors'),
                    },
                },
            },
            contributors: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/contributors/`,
                        meta: this.buildRelatedLinkMeta(model, 'contributors'),
                    },
                },
            },
            cedarMetadataRecords: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/cedar_metadata_records/`,
                        meta: this.buildRelatedLinkMeta(model, 'cedarMetadataRecords'),
                    },
                },
            },
            children: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/children/`,
                        meta: this.buildRelatedLinkMeta(model, 'children'),
                    },
                },
            },
            forks: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/forks/`,
                        meta: this.buildRelatedLinkMeta(model, 'forks'),
                    },
                },
            },
            registrations: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/registrations/`,
                        meta: this.buildRelatedLinkMeta(model, 'registrations'),
                    },
                },
            },
            draftRegistrations: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/draft_registrations/`,
                        meta: this.buildRelatedLinkMeta(model, 'draftRegistrations'),
                    },
                },
            },
            identifiers: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/identifiers/`,
                        meta: this.buildRelatedLinkMeta(model, 'identifiers'),
                    },
                },
            },
            files: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/files/`,
                        meta: this.buildRelatedLinkMeta(model, 'files'),
                    },
                },
            },
            affiliatedInstitutions: {
                links: {
                    self: {
                        href: `${apiUrl}/v2/nodes/${model.id}/relationships/institutions/`,
                        meta: {},
                    },
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/institutions/`,
                        meta: this.buildRelatedLinkMeta(model, 'affiliatedInstitutions'),
                    },
                },
            },
            storage: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/storage/`,
                    },
                },
            },
            subjects: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/subjects/`,
                        meta: this.buildRelatedLinkMeta(model, 'subjects'),
                    },
                },
            },
            subjectsAcceptable: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/subjectsAcceptable/`,
                        meta: this.buildRelatedLinkMeta(model, 'subjectsAcceptable'),
                    },
                },
            },
        };
        if (model.attrs.parentId !== null) {
            const { parentId } = model.attrs;
            relationships.parent = {
                data: {
                    id: parentId as string,
                    type: this.typeKeyForModel(model),
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${parentId}`,
                        meta: {},
                    },
                },
            };
        }
        if (model.attrs.rootId !== null) {
            const { rootId } = model.attrs;
            relationships.root = {
                data: {
                    id: rootId as string,
                    type: this.typeKeyForModel(model),
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${rootId}`,
                        meta: {},
                    },
                },
            };
        }
        if (model.attrs.licenseId !== null) {
            const { licenseId } = model.attrs;
            relationships.license = {
                data: {
                    id: licenseId as string,
                    type: 'licenses',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/licenses/${licenseId}`,
                        meta: {},
                    },
                },
            };
        }
        return relationships;
    }

    buildNormalLinks(model: ModelInstance<MirageNode>) {
        return {
            ...super.buildNormalLinks(model),
            html: `/${model.id}/`,
        };
    }

    buildApiMeta(model: ModelInstance<MirageNode>) {
        return {
            ...super.buildApiMeta(model),
            ...(model.attrs._anonymized ? { anonymous: true } : {}),
        };
    }
}
