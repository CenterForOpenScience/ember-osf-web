import Component from '@glimmer/component';
import config from 'ember-osf-web/config/environment';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';
import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';


interface Args {
    cedarMetadataRecord: CedarMetadataRecordModel;
    cedarMetadataTemplate: CedarMetadataTemplateModel;
}

export default class CedarMetadataRenderer extends Component<Args> {
    config = config.cedarConfig.viewerConfig;

    public get isDraft(): boolean {
        return !this.args.cedarMetadataRecord.isPublished;
    }
}
