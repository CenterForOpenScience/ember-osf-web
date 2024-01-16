import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import { tracked } from '@glimmer/tracking';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';
import NodeModel from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';

interface TabArgs {
    guidNode: NodeModel;
    cedarMetadataRecords: CedarMetadataRecordModel[];
    defaultIndex: number;
}


export default class MetadataTabs extends Component<TabArgs> {
    @service media!: Media;
    @service analytics!: Analytics;

    guidNode = this.args.guidNode;
    cedarMetadataRecords = this.args.cedarMetadataRecords;
    defaultIndex = this.args.defaultIndex || 0;
    @tracked activeId = this.defaultIndex;

    @tracked showTabs = false;
    @tracked showMore = false;

    @action
    changeTab(activeId: number) {
        this.activeId = activeId;
        if (activeId === 0) {
            this.analytics.click('tab', 'Metadata tab - Change tab to: OSF');
        }
    }

    get isMobile() {
        return this.media.isMobile;
    }

    @action
    didRenderList(element: HTMLElement): boolean {
        this.showTabs = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
        return true;
    }

    @action
    clickIcon(): void {
        this.showMore = !this.showMore;
    }
}
