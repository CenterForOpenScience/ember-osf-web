import { Server } from 'ember-cli-mirage';
import config from 'ember-get-config';

import { addModerator } from './views/addModerator';
import { getCitation } from './views/citation';
import { searchCollections } from './views/collection-search';
import { reportDelete } from './views/comment';
import { createBibliographicContributor } from './views/contributor';
import { createDeveloperApp, updateDeveloperApp } from './views/developer-app';
import { createDraftRegistration } from './views/draft-registration';
import {
    folderFilesList,
    nodeFileProviderList,
    nodeFilesListForProvider,
    uploadToFolder,
    uploadToRoot,
} from './views/file';
import { createFork, createRegistrationFork } from './views/fork';
import { guidDetail } from './views/guid';
import { identifierCreate } from './views/identifier';
import { summaryMetrics } from './views/institution';
import { createNode } from './views/node';
import { osfNestedResource, osfResource, osfToManyRelationship } from './views/osf-resource';
import { getProviderSubjects } from './views/provider-subjects';
import { createRegistration, forkRegistration, registrationDetail } from './views/registration';
import { rootDetail } from './views/root';
import { shareSearch } from './views/share-search';
import { createToken } from './views/token';
import { createEmails, updateEmails } from './views/update-email';
import { claimUnregisteredUser, userNodeList } from './views/user';
import { updatePassword } from './views/user-password';
import * as userSettings from './views/user-setting';
import * as wb from './views/wb';

const { OSF: { apiUrl } } = config;

export default function(this: Server) {
    this.passthrough(); // pass through all requests on currrent domain
    // SHARE search
    this.urlPrefix = 'https://share.osf.io';
    this.namespace = '/api/v2/';

    this.post('/search/creativeworks/_search', shareSearch);

    this.urlPrefix = apiUrl;
    this.namespace = '/v2';

    this.get('/', rootDetail);

    osfResource(this, 'developer-app', { path: 'applications', except: ['create', 'update'] });
    this.post('/applications', createDeveloperApp);
    this.patch('/applications/:id', updateDeveloperApp);

    osfResource(this, 'file', { only: ['show', 'update'] });

    this.get('/guids/:id', guidDetail);

    osfResource(this, 'institution', { only: ['index', 'show'], defaultPageSize: 1000 });
    osfNestedResource(this, 'institution', 'users', {
        only: ['index'],
        path: '/institutions/:parentID/users',
    });
    osfNestedResource(this, 'institution', 'userMetrics', {
        only: ['index'],
        path: '/institutions/:parentID/metrics/users',
    });
    osfNestedResource(this, 'institution', 'departmentMetrics', {
        only: ['index'],
        path: '/institutions/:parentID/metrics/departments',
    });
    this.get('/institutions/:id/metrics/summary', summaryMetrics);

    osfResource(this, 'license', { only: ['index', 'show'] });
    osfResource(this, 'citation-style', {
        only: ['index'],
        path: '/citations/styles',
    });

    osfResource(this, 'node', { except: ['create'] });
    this.post('/nodes/', createNode);
    osfResource(this, 'subject', { only: ['show'] });
    osfNestedResource(this, 'subject', 'children', { only: ['index'] });
    osfNestedResource(this, 'node', 'children');
    osfNestedResource(this, 'node', 'contributors', {
        defaultSortKey: 'index',
        onCreate: createBibliographicContributor,
    });

    this.get('/nodes/:parentID/files', nodeFileProviderList); // Node file providers list
    this.get('/nodes/:parentID/files/:fileProviderId', nodeFilesListForProvider); // Node files list for file provider
    this.get('/nodes/:parentID/files/:fileProviderId/:folderId', folderFilesList); // Node folder detail view
    this.put('/nodes/:parentID/files/:fileProviderId/upload', uploadToRoot); // Upload to file provider

    osfNestedResource(this, 'node', 'bibliographicContributors', {
        only: ['index'],
        relatedModelName: 'contributor',
        defaultSortKey: 'index',
    });
    osfNestedResource(this, 'node', 'forks', { only: ['index'] });
    this.post('/nodes/:id/forks', createFork);
    osfNestedResource(this, 'node', 'linkedNodes', { only: ['index'] });
    osfNestedResource(this, 'node', 'linkedRegistrations', { only: ['index'] });
    osfNestedResource(this, 'node', 'registrations', { only: ['index'] });
    this.post('/nodes/:id/registrations', createRegistration);
    osfNestedResource(this, 'node', 'draftRegistrations', { only: ['index'] });
    this.post('/nodes/:guid/draft_registrations', createDraftRegistration);
    osfNestedResource(this, 'node', 'identifiers', { only: ['index'] });
    osfToManyRelationship(this, 'node', 'affiliatedInstitutions', {
        only: ['related', 'add', 'remove'],
        path: '/nodes/:parentID/relationships/institutions',
    });

    osfToManyRelationship(this, 'node', 'subjects', {
        only: ['related', 'self'],
    });

    osfResource(this, 'draft-registration', {
        only: ['index', 'show', 'update'],
        path: '/draft_registrations',
    });
    osfToManyRelationship(this, 'draft-registration', 'subjects');
    osfToManyRelationship(this, 'draft-registration', 'affiliatedInstitutions', {
        only: ['related', 'update', 'add', 'remove'],
        path: '/draft_registrations/:parentID/relationships/institutions',
    });
    osfNestedResource(this, 'draft-registration', 'contributors', {
        defaultSortKey: 'index',
    });

    osfResource(this, 'registration', { except: ['show', 'create'] });
    this.post('/registrations', createRegistration);
    this.get('/registrations/:id', registrationDetail);
    osfNestedResource(this, 'registration', 'children');
    osfNestedResource(this, 'registration', 'forks', { except: ['create'] });
    this.post('/registrations/:id/forks', forkRegistration);

    osfNestedResource(this, 'registration', 'contributors', { defaultSortKey: 'index' });
    osfNestedResource(this, 'registration', 'bibliographicContributors', {
        only: ['index'],
        relatedModelName: 'contributor',
        defaultSortKey: 'index',
    });
    osfNestedResource(this, 'registration', 'forks', { only: ['index'] });
    this.post('/registrations/:id/forks', createRegistrationFork);
    osfNestedResource(this, 'registration', 'linkedNodes', { only: ['index'] });
    osfNestedResource(this, 'registration', 'linkedRegistrations', { only: ['index'] });
    osfToManyRelationship(this, 'registration', 'affiliatedInstitutions', {
        only: ['related', 'update', 'add', 'remove'],
        path: '/registrations/:parentID/relationships/institutions',
    });
    osfNestedResource(this, 'registration', 'identifiers', { only: ['index'] });
    this.post('/registrations/:parentID/identifiers/', identifierCreate);
    osfNestedResource(this, 'registration', 'comments', { only: ['index'] });
    this.get('/registrations/:guid/citation/:citationStyleID', getCitation);
    osfToManyRelationship(this, 'registration', 'subjects', {
        only: ['related', 'self'],
    });
    osfResource(this, 'subject', { only: ['show'] });

    osfNestedResource(this, 'comment', 'reports', {
        except: ['delete'],
        path: '/comments/:parentID/reports',
        relatedModelName: 'comment-report',
    });
    this.del('/comments/:id/reports/:reporter_id', reportDelete);

    osfResource(this, 'registration-schema', { path: '/schemas/registrations' });
    osfNestedResource(this, 'registration-schema', 'schemaBlocks', {
        path: '/schemas/registrations/:parentID/schema_blocks',
        defaultSortKey: 'index',
        defaultPageSize: 1000,
    });

    osfResource(this, 'brand', { only: ['show'] });

    osfResource(this, 'collection');
    osfToManyRelationship(this, 'collection', 'linkedRegistrations', {
        only: ['related', 'add', 'remove'],
    });

    osfResource(this, 'scope', { only: ['index', 'show'] });
    osfResource(this, 'region', { only: ['index', 'show'] });

    this.get('/status', () => ({ meta: { version: '2.8' }, maintenance: null }));

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
    this.post('/users/:parentID/settings/password/', updatePassword);
    this.post('/users/:parentID/claim/', claimUnregisteredUser);

    osfResource(this, 'external-identity', {
        path: '/users/me/settings/identities',
        only: ['index', 'delete'],
    });

    this.get('/users/:id/nodes', userNodeList);
    this.get('/sparse/users/:id/nodes', userNodeList);

    osfNestedResource(this, 'user', 'quickfiles', { only: ['index', 'show'] });

    osfResource(this, 'preprint-provider', { path: '/providers/preprints' });
    osfResource(this, 'registration-provider', { path: '/providers/registrations' });
    osfNestedResource(this, 'registration-provider', 'moderators', {
        only: ['index', 'show', 'update', 'delete'],
        path: '/providers/registrations/:parentID/moderators/',
        relatedModelName: 'moderator',
    });
    this.post('providers/registrations/:parentID/moderators', addModerator);
    osfNestedResource(this, 'registration-provider', 'requests', {
        path: '/providers/registrations/:parentID/requests/',
        relatedModelName: 'registration-request',
    });
    osfNestedResource(this, 'registration-provider', 'registrations', {
        path: '/providers/registrations/:parentID/registrations/',
        relatedModelName: 'registration',
    });
    osfNestedResource(this, 'registration-provider', 'actions', {
        path: '/providers/registrations/:parentID/actions/',
        relatedModelName: 'node-request-action',
    });
    osfNestedResource(this, 'registration-provider', 'licensesAcceptable', {
        only: ['index'],
        path: '/providers/registrations/:parentID/licenses/',
        relatedModelName: 'license',
    });
    this.get('/providers/registrations/:parentID/subjects/', getProviderSubjects);
    osfNestedResource(this, 'registration-provider', 'schemas', {
        only: ['index'],
        path: '/providers/registrations/:parentID/schemas/',
        relatedModelName: 'registration-schema',
    });

    this.get('/providers/registrations/:parentID/subjects/', getProviderSubjects);

    osfResource(this, 'collection-provider', { path: '/providers/collections' });
    osfNestedResource(this, 'collection-provider', 'licensesAcceptable', {
        path: 'providers/collections/:parentID/licenses/',
    });
    osfNestedResource(this, 'collection', 'collectedMetadata', {
        path: 'collections/:parentID/collected_metadata/',
    });
    this.post('/search/collections/', searchCollections);

    osfResource(this, 'subscription', { only: ['index', 'show', 'update'] });

    // Waterbutler namespace
    this.namespace = '/wb';
    this.post('/files/:id/move', wb.moveFile);
    this.post('/files/:id/upload', wb.renameFile);
    this.put('/files/:id/upload', uploadToFolder);
    this.del('/files/:id/delete', wb.deleteFile);
    this.get('/files/:id/download', wb.fileVersions);

    // Private namespace
    this.namespace = '/_';

    this.get('/banners/current/', () => ({
        data: {
            attributes: {
            },
            type: 'banners',
            id: '',
        },
    }));

    osfResource(this, 'meeting', { only: ['index', 'show'] });
    osfToManyRelationship(this, 'meeting', 'submissions', {
        only: ['related'],
        path: '/meetings/:parentID/submissions/',
    });
}
