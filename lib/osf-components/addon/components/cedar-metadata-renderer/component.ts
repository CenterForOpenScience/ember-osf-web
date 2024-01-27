import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import config from 'ember-osf-web/config/environment';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';


interface Args {
    cedarMetadataRecord: CedarMetadataRecordModel;
    displayFileMetadata: Boolean;
}

export default class CedarMetadataRenderer extends Component<Args> {
    @service router!: RouterService;

    viewerConfig = config.cedarConfig.viewerConfig;
    @tracked isShowEditor = false;

    public get isDraft(): boolean {
        return !this.args.cedarMetadataRecord.isPublished;
    }

    @action
    public edit(): void {
        this.isShowEditor = true;
    }

    @action
    public displayArtifactViewer(): void {
        this.isShowEditor = false;
    }
}
