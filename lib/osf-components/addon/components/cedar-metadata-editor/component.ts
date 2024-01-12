import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import config from 'ember-osf-web/config/environment';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';
import AbstractNodeModel from 'ember-osf-web/models/abstract-node';
import FileModel from 'ember-osf-web/models/file';
import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';
import RouterService from '@ember/routing/router-service';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';

const { cedarConfig } = config;

interface Args {
    cedarMetadataRecord: CedarMetadataRecordModel;
    cedarMetadataTemplate: CedarMetadataTemplateModel;
    target: AbstractNodeModel | FileModel;
    edit: boolean;
}

export default class CedarMetadataEditor extends Component<Args> {
    @service store!: Store;
    @service router!: RouterService;

    cedarConfig = cedarConfig.editorConfig;

    @task
    @waitFor
    async save() {
        const cee = document.querySelector('cedar-embeddable-editor');
        let record: CedarMetadataRecordModel;
        if (this.args.edit) {
            record = this.args.cedarMetadataRecord;
        } else {
            record = this.store.createRecord('cedar-metadata-record');
            record.template = this.args.cedarMetadataTemplate;
            record.target = this.args.target;
        }

        // eslint-disable-next-line
        // @ts-ignore
        record.metadata = cee.currentMetadata;
        await record.save();
        // eslint-disable-next-line no-debugger
        debugger;
        this.router.transitionTo('guid-node.metadata', this.args.target.id, record.id);
    }
}
