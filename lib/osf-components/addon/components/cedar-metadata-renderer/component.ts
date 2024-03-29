import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import config from 'ember-osf-web/config/environment';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';
import NodeModel from 'ember-osf-web/models/node';
import Media from 'ember-responsive';


const { OSF: { url: baseURL } } = config;

interface Args {
    cedarMetadataRecord: CedarMetadataRecordModel;
    displayFileMetadata: Boolean;
}

export default class CedarMetadataRenderer extends Component<Args> {
    @service router!: RouterService;
    @service media!: Media;

    viewerConfig = config.cedarConfig.viewerConfig;
    @tracked isShowEditor = false;

    public get hasWritePermission(): boolean {
        const target = this.args.cedarMetadataRecord.target as NodeModel;
        if (target.get('modelName') === 'file') {
            return (target as any).get('target').get('userHasWritePermission');
        } else {
            return target.get('userHasWritePermission');
        }
    }

    public get isDraft(): boolean {
        return !this.args.cedarMetadataRecord.isPublished;
    }

    public get buildCopyLink(): string {
        const target = this.args.cedarMetadataRecord.target as NodeModel;
        return `${baseURL}${target.get('id')}/metadata/${this.args.cedarMetadataRecord.id}`;
    }

    @action
    public edit(): void {
        this.isShowEditor = true;
    }

    @action
    public displayArtifactViewer(): void {
        this.isShowEditor = false;
    }

    get isMobile() {
        return this.media.isMobile;
    }
}
