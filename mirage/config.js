import config from 'ember-get-config';
import { nodeContributorList, nodeLinkedNodeList } from './views/node';
import { userNodeList, userList } from './views/user';

const { OSF: { apiUrl } } = config;

export default function() {
    this.passthrough('/write-coverage'); // for ember-cli-code-coverage

    this.urlPrefix = apiUrl;
    this.namespace = '/v2';
    this.apiBaseUrl = `${this.urlPrefix}${this.namespace}`;

    this.get('/', schema => {
        return schema.roots.first();
    });

    this.get('/institutions');

    this.resource('node', { path: '/nodes' });
    this.get('/nodes/:id/contributors', function(schema, request) {
        return nodeContributorList(schema, request, this);
    });
    this.get('/nodes/:id/linked_nodes', function(schema, request) {
        return nodeLinkedNodeList(schema, request, this);
    });

    this.get('/status', () => {
        return { meta: { version: '2.8' }, maintenance: null };
    });

    this.get('/users', schema => {
        return userList(schema);
    });

    this.get('/users/:id');
    this.get('/users/:id/nodes', function(schema, request) {
        return userNodeList(schema, request, this);
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
