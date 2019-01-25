import { Server } from 'ember-cli-mirage';
import config from 'ember-get-config';

import { reportDelete } from './views/comment';
import { createDeveloperApp, resetClientSecret } from './views/developer-app';
import { guidDetail } from './views/guid';
import { createNode } from './views/node';
import { osfNestedResource, osfResource } from './views/osf-resource';
import { registrationDetail } from './views/registration';
import { rootDetail } from './views/root';
import { createToken } from './views/token';
import { userNodeList } from './views/user';
import { getUserSetting, updateUserSetting } from './views/user-setting';
import { moveFile } from './views/wb';

const { OSF: { apiUrl } } = config;

export default function(this: Server) {
    this.passthrough(); // pass through all requests on currrent domain

    this.urlPrefix = apiUrl;
    this.namespace = '/v2';

    this.get('/', rootDetail);

    osfResource(this, 'developer-app', { path: 'applications', except: ['create'] });
    this.post('/applications', createDeveloperApp);
    this.post('/applications/:id/reset', resetClientSecret);

    this.get('/files/:id');

    this.get('/guids/:id', guidDetail);

    osfResource(this, 'institution', { only: ['index'], defaultPageSize: 1000 });

    osfResource(this, 'node', { except: ['create'] });
    this.post('/nodes/', createNode);
    osfNestedResource(this, 'node', 'children');
    osfNestedResource(this, 'node', 'contributors');
    osfNestedResource(this, 'node', 'forks', { only: ['index'] });
    osfNestedResource(this, 'node', 'linkedNodes', { only: ['index'] });
    osfNestedResource(this, 'node', 'linkedRegistrations', { only: ['index'] });
    osfNestedResource(this, 'node', 'registrations', { only: ['index'] });
    osfNestedResource(this, 'node', 'draftRegistrations', { only: ['index'] });

    osfResource(this, 'registration', { except: ['show'] });
    this.get('/registrations/:id', registrationDetail);
    osfNestedResource(this, 'registration', 'children');
    osfNestedResource(this, 'registration', 'contributors');
    osfNestedResource(this, 'registration', 'linkedNodes', { only: ['index'] });
    osfNestedResource(this, 'registration', 'linkedRegistrations', { only: ['index'] });
    osfNestedResource(this, 'registration', 'comments', { only: ['index'] });
    osfNestedResource(this, 'comment', 'reports', {
        except: ['delete'],
        path: '/comments/:parentID/reports',
        relatedModelName: 'comment-report',
    });
    this.del('/comments/:id/reports/:reporter_id', reportDelete);

    osfResource(this, 'registration-schema', { path: '/schemas/registrations' });

    osfResource(this, 'scope', { only: ['index', 'show'] });
    osfResource(this, 'region', { only: ['index', 'show'] });

    this.get('/status', () => {
        return { meta: { version: '2.8' }, maintenance: null };
    });

    osfResource(this, 'token', { except: ['create'] });
    this.post('/tokens', createToken);

    osfResource(this, 'user', { except: ['create', 'delete'] });
    osfNestedResource(this, 'user', 'institutions', { only: ['index'] });
    this.get('/users/:id/settings', getUserSetting);
    this.patch('/users/:parentID/settings', updateUserSetting);
    osfNestedResource(this, 'user', 'emails', {
        path: '/users/:parentID/settings/emails',
        relatedModelName: 'user-email',
    });

    this.get('/users/:id/nodes', userNodeList);
    osfNestedResource(this, 'user', 'quickfiles', { only: ['index', 'show'] });

    osfResource(this, 'preprint-provider', { path: '/providers/preprints' });

    // Waterbutler namespace
    this.namespace = '/wb';
    this.post('/files/:id/move', moveFile);

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
