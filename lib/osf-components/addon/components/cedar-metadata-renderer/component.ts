import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import config from 'ember-osf-web/config/environment';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';


interface Args {
    cedarMetadataRecord: CedarMetadataRecordModel;
}

export default class CedarMetadataRenderer extends Component<Args> {
    viewerConfig = config.cedarConfig.viewerConfig;
    @service router!: RouterService;

    @tracked isShowEditor = false;

    public get isDraft(): boolean {
        return !this.args.cedarMetadataRecord.isPublished;
    }

    @action
    public edit(): void {
        this.isShowEditor = true;
    }
}
