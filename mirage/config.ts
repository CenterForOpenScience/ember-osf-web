import { Server } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';

import { addonServiceNamespace } from 'ember-osf-web/adapters/addon-service';
import { addonsList } from 'ember-osf-web/mirage/views/addons';
import { createReviewAction } from 'ember-osf-web/mirage/views/review-action';
import { createResource, updateResource } from 'ember-osf-web/mirage/views/resource';
import { getCitation } from './views/citation';
import { createCollectionSubmission, getCollectionSubmissions } from './views/collection-submission';
import { createSubmissionAction } from './views/collection-submission-action';
import { searchCollections } from './views/collection-search';
import { reportDelete } from './views/comment';
import { addContributor, addPreprintContributor, createBibliographicContributor } from './views/contributor';
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
import { postCountedUsage, getNodeAnalytics } from './views/metrics';
import { addCollectionModerator, addRegistrationModerator } from './views/moderator';
import { createNode, storageStatus } from './views/node';
import { osfNestedResource, osfResource, osfToManyRelationship } from './views/osf-resource';
import { getPreprintProviderSubjects, getProviderSubjects } from './views/provider-subjects';
import { getSubjectsAcceptable } from './views/subjects-acceptable';
import {
    createRegistration,
    forkRegistration,
    getProviderRegistrations,
    registrationDetail,
} from './views/registration';
import { createNewSchemaResponse } from './views/schema-response';
import { createSchemaResponseAction } from './views/schema-response-action';
import { rootDetail } from './views/root';
import { shareSearch } from './views/share-search';
import { cardSearch, valueSearch } from './views/search';
import { createToken } from './views/token';
import { createEmails, updateEmails } from './views/update-email';
import {
    claimUnregisteredUser,
    userNodeList,
    userRegistrationList,
    userPreprintList,
} from './views/user';
import { updatePassword } from './views/user-password';
import * as userSettings from './views/user-setting';
import * as addons from './views/addons';
import * as wb from './views/wb';
import { createPreprint, getPreprintVersions, createPreprintVersion } from './views/preprint';

const { OSF: { addonServiceUrl, apiUrl, shareBaseUrl, url: osfUrl } } = config;


export default function(this: Server) {
    this.passthrough(); // pass through all requests on currrent domain
    this.passthrough('https://api.crossref.org/*');

    // SHARE search
    this.urlPrefix = shareBaseUrl;
    this.namespace = '/api/v2/';
    this.post('/search/creativeworks/_search', shareSearch);

    // SHARE-powered search endpoints
    this.urlPrefix = shareBaseUrl;
    this.namespace = '/trove/'; // /api/v3/ works as well, but /trove/ is the preferred URL
    this.get('/index-card-search', cardSearch);
    this.get('/index-value-search', valueSearch);

    this.urlPrefix = osfUrl;
    this.namespace = '/api/v1/';
    this.post('project/:id/boa/submit-job/', () => ({})); // submissions to BoA

    this.urlPrefix = apiUrl;
    this.namespace = '/v2';

    this.get('/', rootDetail);

    osfResource(this, 'addon', { only: ['index']});
    osfResource(this, 'developer-app', { path: 'applications', except: ['create', 'update'] });
    this.post('/applications', createDeveloperApp);
    this.patch('/applications/:id', updateDeveloperApp);

    osfResource(this, 'external-account', {only: ['index', 'show', 'create']});

    osfResource(this, 'file', { only: ['show', 'update'] });
    osfNestedResource(this, 'file', 'versions', {
        only: ['index'],
        path: '/files/:parentID/versions',
    });
    osfNestedResource(this, 'file', 'cedarMetadataRecords', { only: ['index'] });

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

    osfResource(this, 'logs');

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
    this.get('/nodes/:parentID/subjectsAcceptable', getSubjectsAcceptable);
    osfNestedResource(this, 'node', 'contributors', {
        defaultSortKey: 'index',
        onCreate: createBibliographicContributor,
    });
    this.get('/nodes/:parentID/addons/', addonsList);

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
    osfNestedResource(this, 'node', 'cedarMetadataRecords', { only: ['index'] });

    this.post('/nodes/:id/forks', createFork);
    osfNestedResource(this, 'node', 'linkedNodes', { only: ['index'] });
    osfNestedResource(this, 'node', 'linkedByNodes', { only: ['index'] });
    osfNestedResource(this, 'node', 'linkedRegistrations', { only: ['index'] });
    osfNestedResource(this, 'node', 'registrations', { only: ['index'] });
    this.post('/nodes/:id/registrations', createRegistration);
    osfNestedResource(this, 'node', 'draftRegistrations', { only: ['index'] });
    this.post('/nodes/:guid/draft_registrations', createDraftRegistration);
    osfNestedResource(this, 'node', 'identifiers', { only: ['index'] });
    osfToManyRelationship(this, 'node', 'affiliatedInstitutions', {
        only: ['related', 'add', 'remove', 'update'],
        path: '/nodes/:parentID/relationships/institutions',
    });
    this.get('/nodes/:id/storage', storageStatus);
    osfResource(this, 'draft-node', { only: ['show', 'index', 'create'] });
    osfNestedResource(this, 'draft-node', 'draftRegistrations', { only: ['index'] });
    this.get('/draft_nodes/:parentID/files', nodeFileProviderList); // DraftNode file providers list
    this.get('/draft_nodes/:parentID/files/:fileProviderId',
        nodeFilesListForProvider); // DraftNode files list for file provider
    this.get('/draft_nodes/:parentID/files/:fileProviderId/:folderId',
        folderFilesList); // DraftNode folder detail view
    this.put('/draft_nodes/:parentID/files/:fileProviderId/upload', uploadToRoot); // Upload to file provider

    osfToManyRelationship(this, 'node', 'subjects', {
        only: ['related', 'self'],
    });

    osfResource(this, 'draft-registration', {
        only: ['index', 'show', 'update', 'delete'],
        path: '/draft_registrations',
    });
    this.post('/draft_registrations', createDraftRegistration);
    osfToManyRelationship(this, 'draft-registration', 'subjects');
    osfToManyRelationship(this, 'draft-registration', 'affiliatedInstitutions', {
        only: ['related', 'update', 'add', 'remove'],
        path: '/draft_registrations/:parentID/relationships/institutions',
    });
    osfNestedResource(this, 'draft-registration', 'contributors', {
        defaultSortKey: 'index',
        except: ['create'],
    });
    osfNestedResource(this, 'draft-registration', 'bibliographicContributors', {
        only: ['index'],
        relatedModelName: 'contributor',
        defaultSortKey: 'index',
    });
    this.post('/draft_registrations/:draftId/contributors/', addContributor);
    osfNestedResource(this, 'draft-registration', 'bibliographicContributors', {
        only: ['index'],
        relatedModelName: 'contributor',
        defaultSortKey: 'index',
    });

    osfResource(this, 'review-action', {
        only: ['show'],
        path: '/actions',
    });
    osfResource(this, 'registration', { except: ['show', 'create'] });
    this.post('/registrations', createRegistration);
    this.get('/registrations/:id', registrationDetail);
    osfNestedResource(this, 'registration', 'children');
    osfNestedResource(this, 'registration', 'forks', { except: ['create'] });
    osfNestedResource(this, 'registration', 'reviewActions', {
        only: ['index'],
        path: '/registrations/:parentID/actions',
        relatedModelName: 'review-action',
    });
    this.post('/registrations/:parentID/actions', createReviewAction);
    this.post('/registrations/:id/forks', forkRegistration);

    osfNestedResource(this, 'registration', 'contributors', { defaultSortKey: 'index' });
    osfNestedResource(this, 'registration', 'bibliographicContributors', {
        only: ['index'],
        relatedModelName: 'contributor',
        defaultSortKey: 'index',
    });
    osfNestedResource(this, 'registration', 'forks', { only: ['index'] });
    this.post('/registrations/:id/forks', createRegistrationFork);

    osfNestedResource(this, 'registration', 'cedarMetadataRecords', { only: ['index'] });

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
        only: ['related', 'self', 'update'],
    });

    this.get('/registrations/:parentID/files', nodeFileProviderList); // registration file providers list
    this.get('/registrations/:parentID/files/:fileProviderId',
        nodeFilesListForProvider); // registration files list for file provider
    this.get('/registrations/:parentID/files/:fileProviderId/:folderId',
        folderFilesList); // registration folder detail view
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

    osfResource(this, 'schema-response', {
        path: '/schema_responses',
        only: ['index', 'delete', 'show', 'update'],
    });
    this.post('/schema_responses', createNewSchemaResponse);
    osfNestedResource(this, 'registration', 'schemaResponses', {
        path: '/registrations/:parentID/schema_responses',
        only: ['show', 'create', 'index'],
    });
    osfNestedResource(this, 'schema-response', 'actions', {
        path: '/schema_responses/:parentID/actions',
        only: ['show', 'index'],
        relatedModelName: 'schema-response-action',
    });
    this.post('/schema_responses/:revisionId/actions', createSchemaResponseAction);

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
    this.get('/users/:id/registrations', userRegistrationList);
    this.get('/users/:id/preprints', userPreprintList);
    osfNestedResource(this, 'user', 'draftRegistrations', {
        only: ['index'],
    });

    osfResource(this, 'preprint-provider', {
        path: '/providers/preprints',
        defaultPageSize: 1000,
    });
    osfNestedResource(this, 'preprint-provider', 'highlightedSubjects', {
        only: ['index'],
        path: '/providers/preprints/:parentID/subjects/highlighted/',
        relatedModelName: 'subject',
    });

    osfNestedResource(this, 'preprint-provider', 'licensesAcceptable', {
        only: ['index'],
        path: '/providers/preprints/:parentID/licenses/',
        relatedModelName: 'license',
    });

    osfNestedResource(this, 'preprint-provider', 'preprints', {
        path: '/providers/preprints/:parentID/preprints/',
        relatedModelName: 'preprint',
    });

    this.get('/providers/preprints/:parentID/subjects/', getPreprintProviderSubjects);

    osfNestedResource(this, 'preprint-provider', 'citationStyles', {
        only: ['index'],
        path: '/providers/preprints/:parentID/citation_styles/',
        relatedModelName: 'citation-style',
    });

    /**
     * Preprint Details
     */

    osfResource(this, 'preprint');
    this.post('/preprints', createPreprint);

    this.get('/preprints/:id', (schema, request) => {
        const id = request.params.id;
        return schema.preprints.find(id);
    });

    this.get('/preprints/:id/versions', getPreprintVersions);
    this.post('/preprints/:id/versions', createPreprintVersion);

    osfNestedResource(this, 'preprint', 'contributors', {
        path: '/preprints/:parentID/contributors/',
        defaultSortKey: 'index',
        except: ['create'],
    });

    this.post('/preprints/:preprintID/contributors/', addPreprintContributor);

    osfNestedResource(this, 'preprint', 'bibliographicContributors', {
        path: '/preprints/:parentID/bibliographic_contributors/',
        defaultSortKey: 'index',
        relatedModelName: 'contributor',
    });
    osfNestedResource(this, 'preprint', 'files', {
        path: '/preprints/:parentID/files/',
        defaultSortKey: 'index',
        relatedModelName: 'file',
    });

    osfNestedResource(this, 'preprint', 'affiliatedInstitutions', {
        path: '/preprints/:parentID/institutions/',
        defaultSortKey: 'index',
        relatedModelName: 'institution',
    });

    osfToManyRelationship(this, 'preprint', 'affiliatedInstitutions', {
        only: ['related', 'update', 'add', 'remove'],
        path: '/preprints/:parentID/relationships/institutions',
    });

    this.put('/preprints/:parentID/files/:fileProviderId/upload', uploadToRoot); // Upload to file provider

    osfNestedResource(this, 'preprint', 'primaryFile', {
        path: '/wb/files/:fileID/',
        defaultSortKey: 'index',
        relatedModelName: 'file',
    });

    osfToManyRelationship(this, 'preprint', 'subjects', {
        only: ['related', 'self', 'update'],
    });

    osfNestedResource(this, 'preprint', 'identifiers', {
        path: '/preprints/:parentID/identifiers/',
        defaultSortKey: 'index',
        relatedModelName: 'identifier',
    });
    this.get('/preprints/:guid/citation/:citationStyleID', getCitation);

    /**
     * Preprint Review Actions
     */

    osfNestedResource(this, 'preprint', 'reviewActions', {
        path: '/preprints/:parentID/review_actions/',
        defaultSortKey: 'index',
        relatedModelName: 'review-action',
    });
    this.post('/preprints/:parentID/review_actions', createReviewAction);

    /**
     * Preprint Requests
     */

    osfNestedResource(this, 'preprint', 'requests', {
        path: '/preprints/:parentID/requests/',
        defaultSortKey: 'index',
        relatedModelName: 'preprint-request',
    });

    /**
     * Preprint Request Actions
     */
    osfResource(this, 'preprint-request', {path: '/requests'});
    osfNestedResource(this, 'preprint-request', 'actions', {
        path: '/requests/:parentID/actions',
        relatedModelName: 'preprint-request-action',
    });

    /**
     * End Preprint Details
     */

    osfResource(this, 'registration-provider', { path: '/providers/registrations' });
    osfNestedResource(this, 'registration-provider', 'moderators', {
        only: ['index', 'show', 'update', 'delete'],
        path: '/providers/registrations/:parentID/moderators/',
        relatedModelName: 'moderator',
    });
    this.post('providers/registrations/:parentID/moderators', addRegistrationModerator);
    osfNestedResource(this, 'registration-provider', 'subscriptions', {
        path: '/providers/registrations/:parentID/subscriptions',
        only: ['index'],
    });
    osfNestedResource(this, 'registration-provider', 'registrations', {
        only: ['show', 'update', 'delete'],
        path: '/providers/registrations/:parentID/registrations/',
        relatedModelName: 'registration',
    });
    this.get('/providers/registrations/:parentID/registrations/', getProviderRegistrations);
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
    osfNestedResource(this, 'collection-provider', 'moderators', {
        path: '/providers/collections/:parentID/moderators',
        except: ['create'],
        relatedModelName: 'moderator',
    });
    osfNestedResource(this, 'collection-provider', 'subscriptions', {
        path: '/providers/collections/:parentID/subscriptions',
        only: ['index'],
    });
    this.post('providers/collections/:parentID/moderators', addCollectionModerator);
    osfNestedResource(this, 'collection-provider', 'licensesAcceptable', {
        path: 'providers/collections/:parentID/licenses/',
    });
    osfNestedResource(this, 'collection', 'collectionSubmissions', {
        path: 'collections/:parentID/collection_submissions/',
    });
    this.get('collections/:parentID/collection_submissions', getCollectionSubmissions);
    this.post('collections/:parentID/collection_submissions/', createCollectionSubmission);
    this.post('/search/collections/', searchCollections);
    osfResource(this, 'collection-submission', {
        only: ['index', 'show', 'update', 'delete'],
        path: '/collection_submissions',
    });
    osfNestedResource(this, 'collection-submission', 'collectionSubmissionActions', {
        only: ['index'],
        path: '/collection_submissions/:parentID/actions',
        relatedModelName: 'collection-submission-action',
    });
    this.post('/collection_submission_actions/', createSubmissionAction);
    osfResource(this, 'collection-submission-action', {
        only: ['show'],
    });

    osfResource(this, 'custom-file-metadata-record', { only: ['show', 'update'] });
    osfResource(this, 'custom-item-metadata-record', { only: ['show', 'update'] });

    osfResource(this, 'resource', { except: ['index', 'update', 'create'] });
    this.patch('/resources/:id', updateResource);
    this.post('/resources/', createResource);

    osfNestedResource(this, 'registration', 'resources', {
        only: ['index'],
        path: '/registrations/:parentID/resources',
    });

    osfResource(this, 'subscription', { only: ['index', 'show', 'update'] });
    osfResource(this, 'collection-subscription', { only: ['show', 'update'] });
    osfResource(this, 'registration-subscription', { only: ['show', 'update'] });

    // Waterbutler namespace
    this.namespace = '/wb';
    this.post('/files/:id/move', wb.moveFile);
    this.post('/files/:id/upload', wb.renameFile);
    this.put('/files/:id/upload', uploadToFolder);
    this.get('/files/:id/upload/', wb.fileVersions);
    this.del('/files/:id/delete', wb.deleteFile);

    // Private namespace
    this.namespace = '/_';

    osfResource(this, 'cedar-metadata-template', {only: ['index', 'show'] });
    osfResource(this, 'cedar-metadata-record', {only: ['index', 'show', 'update', 'create'] });

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

    // usage reporting
    this.post('/metrics/events/counted_usage/', postCountedUsage);

    // node analytics
    this.get('/metrics/query/node_analytics/:nodeID/:timespan', getNodeAnalytics);


    // Addon service
    this.urlPrefix = addonServiceUrl;
    this.namespace = addonServiceNamespace;
    this.resource('external-storage-services', { only: ['index', 'show'] });
    this.resource('external-citation-services', { only: ['index', 'show'] });
    this.resource('external-computing-services', { only: ['index', 'show'] });
    this.resource('user-references', { only: ['index', 'show'] });
    this.get('/user-references/:userGuid/authorized_storage_accounts/',
        addons.userReferenceAuthorizedStorageAccountList);
    this.get('/user-references/:userGuid/authorized_citation_accounts/',
        addons.userAuthorizedCitationAccountList);
    this.get('/user-references/:userGuid/authorized_computing_accounts/',
        addons.userAuthorizedComputingAccountList);
    this.get('/resource-references/', addons.resourceReferencesList);
    this.resource('resource-references', { only: ['index', 'show'] });
    this.get('/resource-references/:nodeGuid/configured_storage_addons',
        addons.resourceReferenceConfiguredStorageAddonList);
    this.get('/resource-references/:nodeGuid/configured_citation_addons',
        addons.resourceConfiguredCitationAddonList);
    this.get('/resource-references/:nodeGuid/configured_computing_addons',
        addons.resourceConfiguredComputingAddonList);
    this.resource('authorized-storage-accounts', { except: ['index', 'update'] });
    this.patch('authorized-storage-accounts/:id', addons.updateAuthorizedStorageAccount);
    this.post('authorized-storage-accounts', addons.createAuthorizedStorageAccount);
    this.resource('authorized-citation-accounts', { except: ['index', 'update'] });
    this.patch('authorized-citation-accounts/:id', addons.updateAuthorizedCitationAccount);
    this.post('authorized-citation-accounts', addons.createAuthorizedCitationAccount);
    this.resource('authorized-computing-accounts', { except: ['index', 'update'] });
    this.patch('authorized-computing-accounts/:id', addons.updateAuthorizedComputingAccount);
    this.post('authorized-computing-accounts', addons.createAuthorizedComputingAccount);
    this.resource('configured-storage-addons', { only: ['show', 'update', 'delete'] });
    this.get('/configured-storage-addons/', addons.configuredStorageAddonList);
    this.resource('configured-citation-addons', { only: ['show', 'update', 'delete'] });
    this.get('/configured-citation-addons/', addons.configuredCitationAddonList);
    this.resource('configured-computing-addons', { only: ['show', 'update', 'delete'] });
    this.get('/configured-computing-addons/', addons.configuredComputingAddonList);
    this.post('configured-storage-addons', addons.createConfiguredStorageAddon);
    this.post('configured-citation-addons', addons.createConfiguredCitationAddon);
    this.post('configured-computing-addons', addons.createConfiguredComputingAddon);
    this.post('addon-operation-invocations', addons.createAddonOperationInvocation);

    // Reset API url and namespace to use v2 endpoints for tests
    this.urlPrefix = apiUrl;
    this.namespace = '/v2';
}
