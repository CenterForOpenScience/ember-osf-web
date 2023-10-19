import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';
import { PreprintMirageModel } from 'ember-osf-web/mirage/factories/preprint';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class PreprintSerializer extends ApplicationSerializer<PreprintMirageModel> {
    buildNormalLinks(model: ModelInstance) {
        return {
            self: `${apiUrl}/v2/${model.id}/`,
            doi: model.doi ?  `https://doi.org/${model.doi}` : null,
            preprint_doi: model.isPreprintDoi ? `https://doi.org/10.31219/osf.io/${model.id}` : null,
        };
    }

    buildRelationships(model: ModelInstance<PreprintMirageModel>) {
        const relationships: SerializedRelationships<PreprintMirageModel> = {
            provider: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/preprints/${model.provider.id}`,
                        meta: {},
                    },
                },
            },
            contributors: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/preprints/${model.id}/contributors`,
                        meta: this.buildRelatedLinkMeta(model, 'contributors'),
                    },
                },
            },
            bibliographicContributors: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/preprints/${model.id}/bibliographic_contributors/`,
                        meta: this.buildRelatedLinkMeta(model, 'bibliographicContributors'),
                    },
                },
            },
            files: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/preprints/${model.id}/files/`,
                        meta: this.buildRelatedLinkMeta(model, 'files'),
                    },
                },
            },
            primaryFile: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/files/${model.primaryFile.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'files'),
                    },
                },
            },
            license: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/licenses/${model.license.id}/`,
                        meta: {},
                    },
                },
            },
            subjects: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/preprints/${model.id}/subjects/`,
                        meta: this.buildRelatedLinkMeta(model, 'subjects'),
                    },
                },
            },
            reviewActions: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/preprints/${model.id}/review_actions/`,
                        meta: this.buildRelatedLinkMeta(model, 'reviewActions'),
                    },
                },
            },
            requests: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/preprints/${model.id}/requests/`,
                        meta: this.buildRelatedLinkMeta(model, 'requests'),
                    },
                },
            },
            citation: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/preprints/${model.id}/citation/`,
                        meta: {},
                    },
                },
            },
            node: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.node.id}`,
                        meta: this.buildRelatedLinkMeta(model, 'node'),
                    },
                },
            },
        };

        if (model.license !== null) {
            const { id } = model.license;
            relationships.license = {
                data: {
                    id: id as string,
                    type: 'licenses',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/licenses/${id}`,
                        meta: {},
                    },
                },
            };
        }

        return relationships;
    }
}
