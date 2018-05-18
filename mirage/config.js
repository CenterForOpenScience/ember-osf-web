import config from 'ember-get-config';

const { OSF: { apiUrl } } = config;

export default function() {
    this.urlPrefix = apiUrl;
    this.namespace = '/v2';
    this.apiBaseUrl = `${this.urlPrefix}${this.namespace}`;

    this.get('/users/:id', (schema, request) => {
        const userId = request.params.id;
        return {
            data: {
                relationships: {
                    nodes: {
                        links: {
                            related: {
                                href: `${this.apiBaseUrl}/users/${userId}/nodes/`,
                                meta: {},
                            },
                        },
                    },
                },
                links: {
                    self: `${this.apiBaseUrl}/users/${userId}/`,
                    html: `https://osf.io/${userId}/`,
                },
                attributes: {
                    family_name: 'Guid',
                    given_name: 'A',
                    full_name: 'A Guid',
                },
                type: 'users',
                id: userId,
            },
        };
    });

    this.get('/users/:id/nodes', (schema, request) => {
        const userId = request.params.id;
        const nodeIds = ['guid2', 'guid3', 'guid4'];
        const nodePayloads = [];
        for (const id of nodeIds) {
            nodePayloads.push({
                links: {
                    self: `${this.apiBaseUrl}/nodes/${id}/`,
                    html: `https://osf.io/${id}/`,
                },
                attributes: {
                },
                type: 'nodes',
                id,
            });
        }
        return {
            data: nodePayloads,
            meta: {
                total: nodePayloads.length,
            },
            links: {
                self: `${this.apiBaseUrl}/users/${userId}/nodes/`,
            },
        };
    });
}
