import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import Analytics from 'ember-osf-web/services/analytics';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';

interface TabViewArgs {
    cedarMetadataRecord: CedarMetadataRecordModel;
    id: number;
    activeId: number;
}


export default class MetadataTabView extends Component<TabViewArgs> {
    @service media!: Media;
    @service analytics!: Analytics;

    cedarMetadataRecord = this.args.cedarMetadataRecord;

    private logAnalytics(): void {
        // eslint-disable-next-line max-len
        this.analytics.click('tab', `Metadata tab - Change tab to: ${this.cedarMetadataRecord.template.get('schemaName')}`);
    }

    get isActive(): boolean {
        if (this.args.id+ 1 === this.args.activeId) {
            this.logAnalytics();
            return true;
        } else {
            return false;
        }
    }
}
