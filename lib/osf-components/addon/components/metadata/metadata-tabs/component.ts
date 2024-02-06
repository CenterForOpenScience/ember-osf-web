import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import { tracked } from '@glimmer/tracking';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';
import NodeModel from 'ember-osf-web/models/node';

interface TabArgs {
    target: NodeModel;
    cedarMetadataRecords: CedarMetadataRecordModel[];
    defaultIndex: number;
    displayFileMetadata: boolean;
}

export default class MetadataTabs extends Component<TabArgs> {
    @service media!: Media;

    target = this.args.target;

    cedarMetadataRecords = this.args.cedarMetadataRecords;
    defaultIndex = this.args.defaultIndex || 0;
    @tracked activeId = this.defaultIndex;

    @tracked showTabs = false;
    @tracked showMore = false;

    constructor(owner: unknown, args: TabArgs) {
        super(owner, args);
        this.replaceHistory();
    }

    private replaceHistory(): void {
        if (!this.args.displayFileMetadata) {
            if (this.activeId < 1) {
                window.history.replaceState( {} , '',
                    `/${this.target.id}/metadata` );
            } else {
                const cedarMetadataRecord = this.cedarMetadataRecords[this.activeId - 1];
                window.history.replaceState( {} , '',
                    `/${this.target.id}/metadata/${cedarMetadataRecord.id}` );
            }
        }
    }

    @action
    changeTab(activeId: number) {
        this.activeId = activeId;
        this.replaceHistory();
    }

    get isMobile() {
        return this.media.isMobile;
    }

    @action
    didRenderList(element: HTMLElement): boolean {
        this.showTabs = element.scrollHeight > element.clientHeight ||
            element.scrollWidth > element.clientWidth;
        return true;
    }

    @action
    clickIcon(): void {
        this.showMore = !this.showMore;
    }
}
