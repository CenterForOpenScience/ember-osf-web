import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import HeadTagsService from 'ember-cli-meta-tags/services/head-tags';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import moment from 'moment-timezone';

import Institution from 'ember-osf-web/models/institution';
import MetaTags, { HeadTagDef } from 'ember-osf-web/services/meta-tags';
import Ready from 'ember-osf-web/services/ready';
import Features from 'ember-feature-flags/services/features';
import OsfStorageFile from 'ember-osf-web/packages/files/osf-storage-file';
import BitbucketFile from 'ember-osf-web/packages/files/bitbucket-file';
import BoxFile from 'ember-osf-web/packages/files/box-file';
import DataverseFile from 'ember-osf-web/packages/files/dataverse-file';
import DropboxFile from 'ember-osf-web/packages/files/dropbox-file';
import FigshareFile from 'ember-osf-web/packages/files/figshare-file';
import GithubFile from 'ember-osf-web/packages/files/github-file';
import GitlabFile from 'ember-osf-web/packages/files/gitlab-file';
import GoogleDriveFile from 'ember-osf-web/packages/files/google-drive-file';
import OneDriveFile from 'ember-osf-web/packages/files/one-drive-file';
import OwnCloudFile from 'ember-osf-web/packages/files/own-cloud-file';
import S3File from 'ember-osf-web/packages/files/s3-file';
import CurrentUserService from 'ember-osf-web/services/current-user';
import RegistrationModel from 'ember-osf-web/models/registration';
import CustomFileMetadataRecordModel from 'ember-osf-web/models/custom-file-metadata-record';
import ContributorModel from 'ember-osf-web/models/contributor';
import ServiceFile from 'ember-osf-web/packages/files/service-file';
import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';

export default class GuidFile extends Route {
    @service('head-tags') headTagsService!: HeadTagsService;
    @service intl!: Intl;
    @service metaTags!: MetaTags;
    @service ready!: Ready;
    @service currentUser!: CurrentUserService;
    @service store!: Store;
    @service features!: Features;

    headTags?: HeadTagDef[];
    metadata!: CustomFileMetadataRecordModel;

    @task
    @waitFor
    async getResourceReference(resource_uri: string) {
        const serviceNode: ResourceReferenceModel = this.store.peekAll(
            'resource-reference',
        ).find((ref: ResourceReferenceModel) => ref.resourceUri === resource_uri);
        if (serviceNode) {
            return serviceNode;
        } else {
            const references = await this.store.query('resource-reference', {
                filter: { resource_uri },
            });
            return references.firstObject;
        }
    }

    @task
    @waitFor
    async setHeadTags(model: any) {
        const blocker = this.ready.getBlocker();
        const dateCreated = model.dateCreated;
        const dateModified = model.dateModified;
        const institutions = await model.target.get('affiliatedInstitutions');
        const contributors = await model.target.get('bibliographicContributors');
        const metaTagsData = {
            title: this.metadata.title ? this.metadata.title : model.name,
            identifier: model.guid,
            publishedDate: dateCreated ? moment(dateCreated).format('YYYY-MM-DD') : undefined,
            modifiedDate: dateModified ? moment(dateModified).format('YYYY-MM-DD') : undefined,
            institution: institutions.map((institution: Institution) => institution.get('name')),
            description: this.metadata.description ?
                this.metadata.description :
                this.intl.t('general.presented_by_osf'),
            language: this.metadata.language ? this.metadata.language : undefined,
            contributors: (contributors as ContributorModel[]).map(
                (contrib: ContributorModel) => (
                    {
                        givenName: contrib.users.get('givenName'),
                        familyName: contrib.users.get('familyName'),
                    }
                ),
            ),
        };
        this.set('headTags', this.metaTags.getHeadTags(metaTagsData));
        this.headTagsService.collectHeadTags();
        if(!model.target.get('isRegistration')) {
            await taskFor(model.target.get('getEnabledAddons')).perform();
        }
        blocker.done();
    }

    async model(params: { guid: string }) {
        const { guid } = params;
        try {
            const file = await this.store.findRecord('file', guid, {include: 'target'});

            this.metadata = await this.store.findRecord('custom-file-metadata-record', guid);

            const target = await file.target as unknown as RegistrationModel;
            if (target.withdrawn === true) {
                this.transitionTo('guid-registration', target.id);
            }
            const provider = file.provider;
            let storageFile;

            if (this.features.isEnabled('gravy_waffle') && provider !== 'osfstorage') {
                let resourceReference;
                const iri = target?.links?.iri?.toString();
                if (iri) {
                    resourceReference = await taskFor(this.getResourceReference).perform(iri);
                }
                if (resourceReference) {
                    const configuredStorageAddonsList = await resourceReference
                        .hasMany('configuredStorageAddons').load();
                    const storageAddon = configuredStorageAddonsList.find(
                        (addon: ConfiguredStorageAddonModel) => addon.externalServiceName === provider,
                    );

                    if (storageAddon) {
                        storageFile = new ServiceFile(this.currentUser, file, storageAddon);
                        return storageFile;
                    }
                }
            }

            switch (provider) {
            case 'osfstorage':
                storageFile = new OsfStorageFile(this.currentUser, file);
                break;
            case 'bitbucket':
                storageFile = new BitbucketFile(this.currentUser, file);
                break;
            case 'box':
                storageFile = new BoxFile(this.currentUser, file);
                break;
            case 'dataverse':
                storageFile = new DataverseFile(this.currentUser, file);
                break;
            case 'dropbox':
                storageFile = new DropboxFile(this.currentUser, file);
                break;
            case 'figshare':
                storageFile = new FigshareFile(this.currentUser, file);
                break;
            case 'github':
                storageFile = new GithubFile(this.currentUser, file);
                break;
            case 'gitlab':
                storageFile = new GitlabFile(this.currentUser, file);
                break;
            case 'googledrive':
                storageFile = new GoogleDriveFile(this.currentUser, file);
                break;
            case 'onedrive':
                storageFile = new OneDriveFile(this.currentUser, file);
                break;
            case 'owncloud':
                storageFile = new OwnCloudFile(this.currentUser, file);
                break;
            case 's3':
                storageFile = new S3File(this.currentUser, file);
                break;
            default:
                this.transitionTo('not-found', guid);
            }
            return storageFile;
        } catch (error) {
            this.transitionTo('not-found', guid);
            throw error;
        }
    }

    afterModel(model: any) {
        taskFor(this.setHeadTags).perform(model.fileModel);
    }

    buildRouteInfoMetadata() {
        return {
            osfMetrics: {
                itemGuid: this.controller.model.id,
            },
        };
    }
}
