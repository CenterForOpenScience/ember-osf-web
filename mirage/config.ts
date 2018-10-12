import { Server } from 'ember-cli-mirage';
import config from 'ember-get-config';

import { guidDetail } from './views/guid';
import { osfNestedResource, osfResource } from './views/osf-resource';
import { rootDetail } from './views/root';
import { createToken } from './views/token';
import { userNodeList } from './views/user';

const { OSF: { apiUrl } } = config;

export default function(this: Server) {
    this.passthrough(); // pass through all requests on currrent domain

    this.urlPrefix = apiUrl;
    this.namespace = '/v2';
    this.apiBaseUrl = `${this.urlPrefix}${this.namespace}`;

    this.get('/', rootDetail);

    this.get('/files/:id');

    this.get('/guids/:id', guidDetail);

    this.get('/institutions');

    osfResource(this, 'nodes');
    osfNestedResource(this, 'nodes', 'contributors');
    osfNestedResource(this, 'nodes', 'linkedNodes', { only: ['index'] });
    osfNestedResource(this, 'nodes', 'registrations', { only: ['index'] });
    osfNestedResource(this, 'nodes', 'draftRegistrations', { only: ['index'] });

    osfResource(this, 'registrationSchemas', { path: '/schemas/registrations' });

    osfResource(this, 'scopes', { only: ['index', 'show'] });

    this.get('/status', () => {
        return { meta: { version: '2.8' }, maintenance: null };
    });

    osfResource(this, 'tokens', { except: ['create'] });
    this.post('/tokens', createToken);

    osfResource(this, 'users', { except: ['create', 'delete'] });
    osfNestedResource(this, 'users', 'institutions', { only: ['index'] });
    osfNestedResource(this, 'users', 'emails', { path: '/users/:parentID/settings/emails' });

    this.get('/users/:id/nodes', userNodeList);
    osfNestedResource(this, 'users', 'quickfiles', { only: ['index', 'show'] });

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
