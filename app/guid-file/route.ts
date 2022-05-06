import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import HeadTagsService from 'ember-cli-meta-tags/services/head-tags';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import moment from 'moment';

import Institution from 'ember-osf-web/models/institution';
import Analytics from 'ember-osf-web/services/analytics';
import MetaTags, { HeadTagDef } from 'ember-osf-web/services/meta-tags';
import Ready from 'ember-osf-web/services/ready';
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

export default class GuidFile extends Route {
    @service analytics!: Analytics;
    @service('head-tags') headTagsService!: HeadTagsService;
    @service metaTags!: MetaTags;
    @service ready!: Ready;
    @service currentUser!: CurrentUserService;

    headTags?: HeadTagDef[];

    @task
    @waitFor
    async setHeadTags(model: any) {
        const blocker = this.ready.getBlocker();
        const dateCreated = model.dateCreated;
        const dateModified = model.dateModified;
        const institutions = await model.target.get('affiliatedInstitutions');
        const metaTagsData = {
            title: model.name,
            identifier: model.guid,
            publishedDate: dateCreated ? moment(dateCreated).format('YYYY-MM-DD') : undefined,
            modifiedDate: dateModified ? moment(dateModified).format('YYYY-MM-DD') : undefined,
            institution: institutions.map((institution: Institution) => institution.get('name')),
        };
        this.set('headTags', this.metaTags.getHeadTags(metaTagsData));
        this.headTagsService.collectHeadTags();
        blocker.done();
    }

    async model(params: { guid: string }) {
        const { guid } = params;
        try {
            const file = await this.store.findRecord('file', guid, {include: 'target'});
            const target = await file.target as unknown as RegistrationModel;
            if (target.withdrawn === true) {
                this.transitionTo('guid-registration', target.id);
            }
            const provider = file.provider;
            let storageFile;
            if (provider === 'osfstorage') {
                storageFile = new OsfStorageFile(this.currentUser, file);
            } else if (provider === 'bitbucket') {
                storageFile = new BitbucketFile(this.currentUser, file);
            } else if (provider === 'box') {
                storageFile = new BoxFile(this.currentUser, file);
            } else if (provider === 'dataverse') {
                storageFile = new DataverseFile(this.currentUser, file);
            } else if (provider === 'dropbox') {
                storageFile = new DropboxFile(this.currentUser, file);
            } else if (provider === 'figshare') {
                storageFile = new FigshareFile(this.currentUser, file);
            } else if (provider === 'github') {
                storageFile = new GithubFile(this.currentUser, file);
            } else if (provider === 'gitlab') {
                storageFile = new GitlabFile(this.currentUser, file);
            } else if (provider === 'googledrive') {
                storageFile = new GoogleDriveFile(this.currentUser, file);
            } else if (provider === 'onedrive') {
                storageFile = new OneDriveFile(this.currentUser, file);
            } else if (provider === 'owncloud') {
                storageFile = new OwnCloudFile(this.currentUser, file);
            } else if (provider === 's3') {
                storageFile = new S3File(this.currentUser, file);
            } else {
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

    @action
    didTransition() {
        this.analytics.trackPage(true, 'files');
    }
}
