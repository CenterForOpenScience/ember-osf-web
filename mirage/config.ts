import { Server } from 'ember-cli-mirage';
import config from 'ember-get-config';
import { nodeContributorList, nodeLinkedNodeList } from './views/node';
import { tokenList } from './views/token';
import { userList, userNodeList } from './views/user';

const { OSF: { apiUrl } } = config;

export default function(this: Server) {
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

    this.get('/users', (schema, request) => {
        return userList(schema, request);
    });

    this.get('/users/:id');
    this.get('/users/:id/nodes', function(schema, request) {
        return userNodeList(schema, request, this);
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
