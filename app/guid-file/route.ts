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
import ScriptTags from 'ember-osf-web/services/script-tags';
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
import CustomItemMetadataRecordModel from 'ember-osf-web/models/custom-item-metadata-record';

export default class GuidFile extends Route {
    @service('head-tags') headTagsService!: HeadTagsService;
    @service intl!: Intl;
    @service metaTags!: MetaTags;
    @service scriptTags!: ScriptTags;
    @service ready!: Ready;
    @service currentUser!: CurrentUserService;

    headTags?: HeadTagDef[];
    metadata!: CustomFileMetadataRecordModel;
    parentMetadata!: CustomItemMetadataRecordModel;

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
        const id = await model.get('id');
        const parentId = await model.target.get('id');
        this.parentMetadata = await this.store.findRecord('custom-item-metadata-record', parentId);
        const file = await this.store.findRecord('file', id, {include: 'target'});
        const target = await file.target as unknown as RegistrationModel;
        const contributors = await target.get('contributors');
        const firstAuthor = contributors[0];

        const funders = await this.parentMetadata.funders;
        let funderDS = '"funder": [';
        if (funders) {
            for (const funder of funders) {
                const funderName = funder.funder_name;
                funderDS +=
                    `
                        {
                            "@type": "${this.intl.t('general.structured_data.funder_type_organization')}",
                            "name": "${funderName}"
                        }
                    `;
                funderDS += ',';
                funderDS += '\n';
            }
            const lastComma = funderDS.lastIndexOf(',');
            funderDS = funderDS.slice(0, lastComma - 1);
            funderDS += ']';
        }

        const fileModelOverrides = `
            {
                "context": "${this.intl.t('general.structured_data.context')}",
                "@type": "${this.intl.t('general.structured_data.dataset')}",
                "name": "${metaTagsData.title}",
                "description": "${metaTagsData.description}",
                "url": "${model.links.self}",
                "isBasedOn": "${model.links.relationships.target.links.related.href}",
                "identifier": "${model.links.self}",
                "isAccessibleForFree": true,
                "creator": {
                    "@type": "${this.intl.t('general.structured_data.creator_type_person')}",
                    "name": "${firstAuthor}"
                },
                ${funderDS},
                "distribution": [
                    {
                        "@type": "${this.intl.t('general.structured_data.distribution_type')}",
                        "encodingFormat": "${this.intl.t('general.structured_data.encoding_format_md5')}",
                        "contentUrl": "${model.links.download}"
                    },
                    {
                        "@type": "${this.intl.t('general.structured_data.distribution_type')}",
                        "encodingFormat": "${this.intl.t('general.structured_data.encoding_format_sha2')}",
                        "contentUrl": "${model.links.download}"
                    }
                ]
            }
        `;

        const jsonLD: object | undefined = await this.scriptTags.returnStructuredData(id);
        const jsonString: string = jsonLD ?
            JSON.stringify(jsonLD) : fileModelOverrides;
        const scriptTagData = {
            type: 'application/ld+json',
            content: jsonString,
        };

        const metaTags: HeadTagDef[] = this.metaTags.getHeadTags(metaTagsData);
        const scriptTag: HeadTagDef[] = this.scriptTags.getHeadTags(scriptTagData);
        const allTags: HeadTagDef[] = metaTags.concat(scriptTag);

        // Concatenate meta and script tags if both, only meta tags or none
        if (metaTags && scriptTag) {
            this.set('headTags', allTags);
        } else if (metaTags) {
            this.set('headTags', metaTags);
        }
        // Rebuild head tags and clear blocker
        this.headTagsService.collectHeadTags();
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
