import { action } from '@ember/object';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import config from 'ember-osf-web/config/environment';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';

const { cedarConfig } = config;

interface Args {
    instanceObject: any;
    cedarMetadataTemplate: any;
    target: any;
    edit: boolean;
}

export default class CedarMetadataEditor extends Component<Args> {
    @service store!: Store;

    cedarConfig = cedarConfig.editorConfig;

    @action
    save() {
        const cee = document.querySelector('cedar-embeddable-editor');
        let record: CedarMetadataRecordModel;
        if (this.args.edit) {
            record = this.args.instanceObject;
        } else {
            record = this.store.createRecord('cedar-metadata-record');
            record.template = this.args.cedarMetadataTemplate;
            record.target = this.args.target;
        }

        // eslint-disable-next-line
        // @ts-ignore
        record.metadata = cee.currentMetadata;
        record.save();
    }
}
