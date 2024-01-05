import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import Analytics from 'ember-osf-web/services/analytics';
import { tracked } from '@glimmer/tracking';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';
import NodeModel from 'ember-osf-web/models/node';

interface TabArgs {
    guidNode: NodeModel;
    templates: [CedarMetadataRecordModel];
}


export default class MetadataTabs extends Component<TabArgs> {
    @service media!: Media;
    @service analytics!: Analytics;

    guidNode = this.args.guidNode;
    templates = this.args.templates;

    @tracked showTabs = false;
    @tracked showMore = false;

    @action
    changeTab(activeId: number) {
        const tabName = activeId === 0 ? 'registrations' : 'drafts';
        this.analytics.click('tab', `Registrations tab - Change tab to: ${tabName}`);
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
