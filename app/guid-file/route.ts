import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import HeadTagsService from 'ember-cli-meta-tags/services/head-tags';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import moment from 'moment';

import Institution from 'ember-osf-web/models/institution';
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
import CustomFileMetadataRecordModel from 'ember-osf-web/models/custom-file-metadata-record';
import RouterService from '@ember/routing/router-service';
import config from 'ember-get-config';
import { assert } from '@ember/debug';
import getHref from 'ember-osf-web/utils/get-href';
import ScriptTags from 'ember-osf-web/services/script-tags';

export default class GuidFile extends Route {
    @service('head-tags') headTagsService!: HeadTagsService;
    @service intl!: Intl;
    @service metaTags!: MetaTags;
    @service scriptTags!: ScriptTags;
    @service ready!: Ready;
    @service currentUser!: CurrentUserService;
    @service router!: RouterService;

    headTags?: HeadTagDef[];
    metadata!: CustomFileMetadataRecordModel;
    structuredData?: string;

    @task
    @waitFor
    async setHeadTags(model: any) {
        const blocker = this.ready.getBlocker();
        const dateCreated = model.dateCreated;
        const dateModified = model.dateModified;
        const institutions = await model.target.get('affiliatedInstitutions');
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
        };

        // Google Structured Data
        const { environment } = config;
        const parentGuid = Object.values(model.links['relationships']['target']['data']);
        const parentGuidString: string = parentGuid[1] as string;
        const jsonLD: Promise<{}> = await this.returnStructuredData(parentGuidString, environment);

        if (jsonLD) {
            this.set('structuredData', jsonLD);
        }

        const jsonString: string = this.structuredData ?
            JSON.stringify(this.structuredData) : JSON.stringify({ isAccessibleForFree : true });

        const scriptTagsData = {
            type: 'application/ld+json',
            src: `osf.io/${parentGuidString}/metadata/?format=google-dataset-json-ld`,
            content: jsonString,
        };

        const metaTags: HeadTagDef[] = this.metaTags.getHeadTags(metaTagsData);
        const scriptTags: HeadTagDef[] = this.scriptTags.getHeadTags(scriptTagsData);
        const allTags: HeadTagDef[] = metaTags.concat(scriptTags);

        // Concatenate meta and script tags if both, only meta tags or none
        if (metaTags && scriptTags) {
            this.set('headTags', allTags);
        } else if (metaTags) {
            this.set('headTags', metaTags);
        }
        // Rebuild head tags and clear blocker
        this.headTagsService.collectHeadTags();
        blocker.done();
    }

    async returnStructuredData(parentGuid: string,  environment: string): Promise<any> {
        const url = `/${parentGuid}/metadata/?format=google-dataset-json-ld`;
        let jsonLD: object = {};

        if (environment === 'production') {
            assert(`Currently on ${environment}`, Boolean('production'));
        } else if (environment === 'staging' || environment === 'staging2' || environment === 'staging3') {
            if (environment === 'staging') {
                assert(`Currently on ${environment}`, Boolean('staging'));
            } else if (environment === 'staging2') {
                assert(`Currently on ${environment}`, Boolean('staging2'));
            } else if (environment === 'staging3') {
                assert(`Currently on ${environment}`, Boolean('staging3'));
            }
        } else if (environment === 'development') {
            assert(`Currently on ${environment}`, Boolean('development'));
        } else if (environment === 'test') {
            assert(`Currently on ${environment}`, Boolean('test'));
        } else {
            throw new Error('Environment not found.');
        }

        // Override url
        config.OSF.url.replace(/\/$/, url);

        let jsonFetch : object | void;
        try {
            jsonFetch = await this.returnJSON(url);

            if (jsonFetch && (typeof(jsonFetch) === 'object')) {
                jsonLD = jsonFetch;
                const JSONLDString = JSON.stringify(jsonLD);
                this.set('structuredData', JSONLDString);
            }
            return jsonLD;
        } catch (e) {
            throw new Error(this.intl.t('general.structured_data.json_ld_retrieval_error'));
        }
    }

    async returnJSON(url: string) {
        const ajax = await this.currentUser.authenticatedAJAX({
            method: 'GET',
            url: getHref(url),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return ajax;
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

            switch(provider){
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
