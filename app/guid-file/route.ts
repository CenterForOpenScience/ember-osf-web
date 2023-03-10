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

export default class GuidFile extends Route {
    @service('head-tags') headTagsService!: HeadTagsService;
    @service intl!: Intl;
    @service metaTags!: MetaTags;
    @service ready!: Ready;
    @service currentUser!: CurrentUserService;
    @service router!: RouterService;

    headTags?: HeadTagDef[];
    metadata!: CustomFileMetadataRecordModel;
    projectMetadata?: CustomFileMetadataRecordModel;
    componentMetadata?: CustomFileMetadataRecordModel;
    registrationMetadata?: CustomFileMetadataRecordModel;

    @task
    @waitFor
    async setHeadTags(model: any) {
        const blocker = this.ready.getBlocker();
        const dateCreated = model.dateCreated;
        const dateModified = model.dateModified;
        const institutions = await model.target.get('affiliatedInstitutions');
        let structuredData;
        // Google Structured Data
        if (this.router.currentRouteName === 'guid-file') {
            this.metadata.dataType = this.intl.t('general.dataset');

            const metadataTags = this.metaTags.getMetaTags(this.metadata);
            const projectMetadataTags = this.projectMetadata ?
                this.metaTags.getMetaTags(this.projectMetadata) : {};
            const componentMetadataTags = this.componentMetadata ?
                this.metaTags.getMetaTags(this.componentMetadata) : {};
            const registrationMetadataTags = this.registrationMetadata ?
                this.metaTags.getMetaTags(this.registrationMetadata) : {};

            structuredData = `
                <script type="application/ld+json">
                    {
                        "context": "${this.intl.t('general.context')}",
                        "@type": "${metadataTags.citation_type}",
                        "name": "${metadataTags.citation_title}",
                        "description": "${metadataTags.citation_description}",
                        "url": "${metadataTags.citation_public_url}",
                        "sameAs": "${metadataTags.citation_publisher}",
                        "identifier": "${metadataTags.citation_doi}",
                        "keyWords": [
                            "${metadataTags.citation_keywords}"
                        ],
                        "isAccessibleForFree": true,
                        "hasPart": [{
                                "@type": "${projectMetadataTags.citation_type}",
                                "name": "${projectMetadataTags.citation_title}",
                                "description": "${projectMetadataTags.citation_description}",
                                "license": "${projectMetadataTags.citation_license}",
                                "creator": {
                                    "@type": "${projectMetadataTags.citation_creator_type}",
                                    "name": "${projectMetadataTags.citation_author}"
                                }
                            },
                            {
                                "@type": "${componentMetadataTags.citation_type}",
                                "name": "${componentMetadataTags.citation_title}",
                                "description": "${componentMetadataTags.citation_description}",
                                "license": "${componentMetadataTags.citation_license}",
                                "creator": {
                                    "@type": "${componentMetadataTags.citation_creator_type}",
                                    "name": "${componentMetadataTags.citation_author}"
                                }
                            },
                            {
                                "@type": "${registrationMetadataTags.citation_type}",
                                "name": "${registrationMetadataTags.citation_title}",
                                "description": "${registrationMetadataTags.citation_description}",
                                "license": "${registrationMetadataTags.citation_license}",
                                "creator": {
                                    "@type": "${registrationMetadataTags.citation_creator_type}",
                                    "name": "${registrationMetadataTags.citation_author}"
                                }
                            }
                        ],
                        "creator": {
                            "@type": "${metadataTags.citation_creator_type}",
                            "url": "${metadataTags.citation_public_url}",
                            "name": "${metadataTags.citation_author}",
                            "contactPoint": {
                                "@type": "${this.intl.t('general.contact_point.type')}",
                                "contactType": "${this.intl.t('general.contact_point.contact_type')}",
                                "telephone": "",
                                "email": "${this.intl.t('general.contact_point.email')}"
                            }
                        },
                        "funder": {
                            "@type": "${metadataTags.citation_funder_type}",
                            "sameAs": "${metadataTags.citation_funder_award_uri}",
                            "name": "${metadataTags.citation_funder_name}"
                        },
                        "distribution": [{
                            "@type": "${this.intl.t('general.distribution.type')}",
                            "encodingFormat": "${this.intl.t('general.distribution.encoding_format')}",
                            "contentUrl": "${metadataTags.citation_public_url}"
                        }],
                        "temporalCoverage": "${metadataTags.citation_publication_date}
                            / ${metadataTags.citation_modificaton_date}",
                        "spatialCoverage": {
                            "@type": "${metadataTags.citation_type}",
                            "geo": {
                                "@type": "${this.intl.t('general.spatial_coverage.geo.type')}",
                                "box": "${this.intl.t('general.spatial_coverage.geo.box')}"
                            }
                        }
                    }
                </script>
            `;
        }

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
            script: structuredData,
        };
        this.set('headTags', this.metaTags.getHeadTags(metaTagsData));
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
