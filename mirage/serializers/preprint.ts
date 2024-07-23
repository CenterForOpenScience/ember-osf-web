import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';
import { PreprintMirageModel } from 'ember-osf-web/mirage/factories/preprint';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class PreprintSerializer extends ApplicationSerializer<PreprintMirageModel> {
    buildNormalLinks(model: ModelInstance) {
        return {
            self: `${apiUrl}/v2/preprints/${model.id}/`,
            doi: model.doi ?  `https://doi.org/${model.doi}` : null,
            preprint_doi: model.isPreprintDoi ? `https://doi.org/10.31219/osf.io/${model.id}` : null,
        };
    }

    buildRelationships(model: ModelInstance<PreprintMirageModel>) {
        const relationships: SerializedRelationships<PreprintMirageModel> = {};

        if (model.provider) {
            relationships.provider = {
                data: {
                    id: model.provider.id,
                    type: 'preprint-providers',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/preprints/${model.provider.id}`,
                        meta: {},
                    },
                },
            };
        }

        if (model.contributors) {
            relationships.contributors = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/preprints/${model.id}/contributors`,
                        meta: this.buildRelatedLinkMeta(model, 'contributors'),
                    },
                },
            };
        }

        if (model.bibliographicContributors) {
            affiliatedInstitutions: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/preprints/${model.id}/institutions/`,
                        meta: this.buildRelatedLinkMeta(model, 'affiliatedInstitutions'),
                    },
                },
            },
            relationships.bibliographicContributors = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/preprints/${model.id}/bibliographic_contributors/`,
                        meta: this.buildRelatedLinkMeta(model, 'bibliographicContributors'),
                    },
                },
            };
        }

        if (model.files) {
            relationships.files = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/preprints/${model.id}/files/`,
                        meta: this.buildRelatedLinkMeta(model, 'files'),
                    },
                },
            };
        }

        if (model.subjects) {
            relationships.subjects = {
                links: {
                    self: {
                        href: `${apiUrl}/v2/preprints/${model.id}/relationships/subjects/`,
                        meta: {},
                    },
                    related: {
                        href: `${apiUrl}/v2/preprints/${model.id}/subjects/`,
                        meta: this.buildRelatedLinkMeta(model, 'subjects'),
                    },
                },
            };
        }

        if (model.reviewActions) {
            relationships.reviewActions = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/preprints/${model.id}/review_actions/`,
                        meta: this.buildRelatedLinkMeta(model, 'reviewActions'),
                    },
                },
            };
        }

        if (model.requests) {
            relationships.requests = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/preprints/${model.id}/requests/`,
                        meta: this.buildRelatedLinkMeta(model, 'requests'),
                    },
                },
            };
        }

        if (model.citation) {
            relationships.citation = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/preprints/${model.id}/citation/`,
                        meta: {},
                    },
                },
            };
        }

        if (model.identifiers) {
            relationships.identifiers = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/preprints/${model.id}/identifiers/`,
                        meta: this.buildRelatedLinkMeta(model, 'identifiers'),
                    },
                },
            };
        }

        if (model.node) {
            relationships.node = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.nodeId}`,
                        meta: {},
                    },
                },
            };
        }

        if (model.primaryFile) {
            relationships.primaryFile = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/files/${model.primaryFile.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'files'),
                    },
                },
            };
        }

        if (model.license) {
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
