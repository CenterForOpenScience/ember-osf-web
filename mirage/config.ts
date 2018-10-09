import { Server } from 'ember-cli-mirage';
import config from 'ember-get-config';
import { osfNestedResource, osfResource } from './views';
import { rootDetail } from './views/root';
import { userFileList, userNodeList } from './views/user';

const { OSF: { apiUrl } } = config;

function queryParamIsTruthy(value?: string) {
    return Boolean(
        value && ['true', '1'].includes(value.toString().toLowerCase()),
    );
}

export default function(this: Server) {
    this.passthrough(); // pass through all requests on currrent domain

    this.urlPrefix = apiUrl;
    this.namespace = '/v2';
    this.apiBaseUrl = `${this.urlPrefix}${this.namespace}`;

    this.get('/', function(schema) {
        return rootDetail(schema, this);
    });

    this.get('/files/:id');

    this.get('/guids/:id', (schema, request) => {
        const { id } = request.params;
        const { resolve } = request.queryParams;
        const guid = schema.guids.find(id);
        if (queryParamIsTruthy(resolve)) {
            return schema[guid.referentType].find(id);
        }
        return guid;
    });

    this.get('/institutions');

    osfResource(this, 'nodes');
    osfNestedResource(this, 'nodes', 'contributors');
    osfNestedResource(this, 'nodes', 'linkedNodes', { only: ['index'] });
    osfNestedResource(this, 'nodes', 'registrations', { only: ['index'] });
    osfNestedResource(this, 'nodes', 'draftRegistrations', { only: ['index'] });

    osfResource(this, 'registration-schemas', { path: '/schemas/registrations' });

    osfResource(this, 'scopes', { only: ['index', 'show'] });

    this.get('/status', () => {
        return { meta: { version: '2.8' }, maintenance: null };
    });

    osfResource(this, 'tokens', { except: ['create'] });
    this.post('/tokens', function(schema) {
        const attrs = this.normalizedRequestAttrs();
        const token = schema.tokens.create(attrs);
        token.attrs.tokenId = 'blahblah';
        return token;
    });

    osfResource(this, 'users', { except: ['create', 'delete'] });
    osfNestedResource(this, 'users', 'institutions', { only: ['index'] });
    osfNestedResource(this, 'users', 'emails', { path: '/users/:parentID/settings/emails' });

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
