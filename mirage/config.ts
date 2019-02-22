import { Server } from 'ember-cli-mirage';
import config from 'ember-get-config';

import { updateBookmarks } from './views/collection';
import { reportDelete } from './views/comment';
import { createDeveloperApp, resetClientSecret } from './views/developer-app';
import { createFork, createRegistrationFork } from './views/fork';
import { guidDetail } from './views/guid';
import { institutionAdd, institutionDelete, institutionUpdate } from './views/institution';
import { createNode } from './views/node';
import { osfNestedResource, osfResource } from './views/osf-resource';
import { forkRegistration, registrationDetail } from './views/registration';
import { rootDetail } from './views/root';
import { createToken } from './views/token';
import { createEmails, updateEmails } from './views/update-email';
import { userNodeList } from './views/user';
import { deleteUserAddon } from './views/user-addon';
import { getAccount, deleteAccount, saveAccount } from './views/account';
import * as userSettings from './views/user-setting';
import * as wb from './views/wb';

const { OSF: { apiUrl } } = config;

export default function(this: Server) {
    this.passthrough(); // pass through all requests on currrent domain

    this.urlPrefix = apiUrl;
    this.namespace = '/v2';

    this.get('/', rootDetail);

    osfResource(this, 'developer-app', { path: 'applications', except: ['create'] });
    this.post('/applications', createDeveloperApp);
    this.post('/applications/:id/reset', resetClientSecret);

    osfResource(this, 'file', { only: ['show', 'update'] });

    this.get('/guids/:id', guidDetail);

    osfResource(this, 'institution', { only: ['index'], defaultPageSize: 1000 });
    osfResource(this, 'license', { only: ['index', 'show'] });

    osfResource(this, 'node', { except: ['create'] });
    this.post('/nodes/', createNode);
    osfNestedResource(this, 'node', 'children');
    osfNestedResource(this, 'node', 'contributors');
    osfNestedResource(this, 'node', 'forks', { only: ['index'] });
    this.post('/nodes/:id/forks', createFork);
    osfNestedResource(this, 'node', 'linkedNodes', { only: ['index'] });
    osfNestedResource(this, 'node', 'linkedRegistrations', { only: ['index'] });
    osfNestedResource(this, 'node', 'registrations', { only: ['index'] });
    osfNestedResource(this, 'node', 'draftRegistrations', { only: ['index'] });
    osfNestedResource(this, 'node', 'identifiers', { only: ['index'] });
    osfNestedResource(this, 'node', 'affiliatedInstitutions', {
        only: ['index'],
        path: '/nodes/:parentID/institutions',
    });
    osfNestedResource(this, 'node', 'affiliatedInstitutions', {
        only: ['create', 'delete', 'update'],
        path: '/nodes/:parentID/relationships/institutions',
        views: {
            create: institutionAdd,
            delete: institutionDelete,
            update: institutionUpdate,
        },
    });

    osfResource(this, 'registration', { except: ['show'] });
    this.get('/registrations/:id', registrationDetail);
    osfNestedResource(this, 'registration', 'children');
    osfNestedResource(this, 'registration', 'forks', { except: ['create'] });
    this.post('/registrations/:id/forks', forkRegistration);

    osfNestedResource(this, 'registration', 'contributors', { defaultSortKey: 'index' });
    osfNestedResource(this, 'registration', 'forks', { only: ['index'] });
    this.post('/registrations/:id/forks', createRegistrationFork);
    osfNestedResource(this, 'registration', 'linkedNodes', { only: ['index'] });
    osfNestedResource(this, 'registration', 'linkedRegistrations', { only: ['index'] });
    osfNestedResource(this, 'registration', 'affiliatedInstitutions', {
        path: '/registrations/:parentID/institutions',
        relatedModelName: 'institution',
    });
    osfNestedResource(this, 'registration', 'identifiers', { only: ['index'] });
    osfNestedResource(this, 'registration', 'comments', { only: ['index'] });
    osfNestedResource(this, 'comment', 'reports', {
        except: ['delete'],
        path: '/comments/:parentID/reports',
        relatedModelName: 'comment-report',
    });
    this.del('/comments/:id/reports/:reporter_id', reportDelete);

    osfResource(this, 'registration-schema', { path: '/schemas/registrations' });

    osfResource(this, 'collection');
    osfNestedResource(this, 'collection', 'linkedRegistrations', { only: ['index'] });

    this.post('/collections/:id/relationships/linked_registrations', updateBookmarks);
    this.del('/collections/:id/relationships/linked_registrations', updateBookmarks);

    osfResource(this, 'scope', { only: ['index', 'show'] });
    osfResource(this, 'region', { only: ['index', 'show'] });

    this.get('/status', () => {
        return { meta: { version: '2.8' }, maintenance: null };
    });

    osfResource(this, 'addon', { except: ['create', 'delete'] });
    osfNestedResource(this, 'user', 'addons', {
        path: '/users/:parentID/addons',
        relatedModelName: 'user-addon',
    });
    this.del('/users/:parentID/addons/:id', deleteUserAddon);

    this.get('/users/:parentID/addons/:addonID/accounts', getAccount);
    this.post('/users/:parentID/addons/:addonID/accounts', saveAccount);
    this.del('/users/:parentID/addons/:addonID/accounts/:id', deleteAccount);

    osfResource(this, 'token', { except: ['create'] });
    this.post('/tokens', createToken);

    osfResource(this, 'user', { except: ['create', 'delete'] });
    osfNestedResource(this, 'user', 'institutions', { only: ['index'] });
    this.get('/users/:id/settings', userSettings.getUserSetting);
    this.patch('/users/:parentID/settings', userSettings.updateUserSetting);
    osfNestedResource(this, 'user', 'emails', {
        except: ['update', 'create'],
        path: '/users/:parentID/settings/emails',
        relatedModelName: 'user-email',
    });
    this.patch('/users/:parentID/settings/emails/:emailID/', updateEmails);
    this.post('/users/:parentID/settings/emails/', createEmails);
    this.post('/users/:id/settings/export', userSettings.requestExport);

    this.get('/users/:id/nodes', userNodeList);
    osfNestedResource(this, 'user', 'quickfiles', { only: ['index', 'show'] });

    osfResource(this, 'preprint-provider', { path: '/providers/preprints' });

    // Waterbutler namespace
    this.namespace = '/wb';
    this.post('/files/:id/move', wb.moveFile);
    this.post('/files/:id/upload', wb.renameFile);
    this.del('/files/:id/delete', wb.deleteFile);
    this.get('/files/:id/download', wb.fileVersions);

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
