import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import Analytics from 'ember-osf-web/services/analytics';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';

interface TabArgs {
    cedarMetadataRecord: CedarMetadataRecordModel;
}

export default class MetadataDetail extends Component<TabArgs> {
    @service media!: Media;
    @service analytics!: Analytics;

    cedarMetadataRecord = this.args.cedarMetadataRecord;

    get isMobile() {
        return this.media.isMobile;
    }
}
