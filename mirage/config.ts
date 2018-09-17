import { Server } from 'ember-cli-mirage';
import config from 'ember-get-config';
import { relationshipList } from './views';
import { rootDetail } from './views/root';
import { tokenList } from './views/token';
import { userFileList, userList, userNodeList } from './views/user';

const { OSF: { apiUrl } } = config;

export default function(this: Server) {
    this.passthrough('/write-coverage'); // for ember-cli-code-coverage

    this.urlPrefix = apiUrl;
    this.namespace = '/v2';
    this.apiBaseUrl = `${this.urlPrefix}${this.namespace}`;

    this.get('/', function(schema) {
        return rootDetail(schema, this);
    });

    this.get('/files/:id');
    this.get('/institutions');

    this.resource('node', { path: '/nodes' });
    this.get('/nodes/:id/contributors', function(schema, request) {
        return relationshipList('nodes', 'contributors', schema, request, this);
    });
    this.get('/nodes/:id/linked_nodes', function(schema, request) {
        return relationshipList('nodes', 'linkedNodes', schema, request, this);
    });
    this.get('/nodes/:id/registrations', function(schema, request) {
        return relationshipList('nodes', 'registrations', schema, request, this);
    });
    this.get('/nodes/:id/draft_registrations', function(schema, request) {
        return relationshipList('nodes', 'draftRegistrations', schema, request, this);
    });

    this.resource('registration-schemas', { path: '/schemas/registrations' });

    this.get('/status', () => {
        return { meta: { version: '2.8' }, maintenance: null };
    });

    this.get('/users', (schema, request) => {
        return userList(schema, request);
    });

    this.get('/users/:id');
    this.get('/users/:id/institutions', function(schema, request) {
        return relationshipList('users', 'institutions', schema, request, this);
    });
    this.get('/users/:id/nodes', function(schema, request) {
        return userNodeList(schema, request, this);
    });
    this.get('/users/:id/quickfiles', function(schema, request) {
        return userFileList(schema, request, this);
    });
    this.get('/users/:userid/quickfiles/:id', (schema, request) => {
        const { id } = request.params;
        return schema.files.find(id);
    });

    this.get('tokens', function(schema, request) {
        return tokenList(schema, request, this);
    });
    this.resource('tokens', { except: ['index'] });
    this.resource('scopes', { only: ['index', 'show'] });

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
