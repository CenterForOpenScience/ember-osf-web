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

    this.get('/', () => {
        return {
            meta: {
                message: 'Welcome to the OSF API.',
                version: '2.8',
                active_flags: [
                    'ember_support_page',
                    'ember_home_page',
                    'ember_project_forks_page',
                ],
                current_user: null,
            },
            links: {
                collections: `${this.apiBaseUrl}/collections/`,
                users: `${this.apiBaseUrl}/users/`,
                licenses: `${this.apiBaseUrl}/licenses/`,
                nodes: `${this.apiBaseUrl}/nodes/`,
                addons: `${this.apiBaseUrl}/addons/`,
                institutions: `${this.apiBaseUrl}/institutions/`,
                metaschemas: `${this.apiBaseUrl}/metaschemas/`,
                registrations: `${this.apiBaseUrl}/registrations/`,
            },
        };
    });

    this.get('/status', () => {
        return { meta: { version: '2.8' }, maintenance: null };
    });

    this.get('/_waffle', () => {
        const flags = {
            ember_create_draft_registration_page: false,
            ember_edit_draft_registrationfile_detail_page: false,
            ember_meeting_detail_page: false,
            ember_meetings_page: false,
            ember_my_projects_page: false,
            ember_project_analytics_page: false,
            ember_project_contributors_page: false,
            ember_project_detail_page: false,
            ember_project_registrations_page: false,
            ember_project_settings_page: false,
            ember_project_wiki_page: false,
            ember_registration_form_detail_page: false,
            ember_search_page: false,
            ember_user_profile_page: false,
            ember_user_settings_page: false,
            ember_support_page: true,
            ember_dashboard_page: false,
            ember_home_page: true,
            ember_project_forks_page: true,
        };
        const waffles = [];
        Object.entries(flags).forEach(([name, active]) => waffles.push({
            links: {},
            attributes: { active, note: '', name },
            type: 'flag',
            id: `flag_${waffles.length + 1}`,
        }));
        return { data: waffles };
    });

    // Private namespace
    this.namespace = '/_';

    this.get('/banners/current/', () => {
        return {
            data: {
                attributes: {
                },
                type: 'banners',
                id: '',
            },
        };
    });
}
