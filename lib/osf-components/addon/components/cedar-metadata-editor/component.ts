import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import config from 'ember-osf-web/config/environment';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';
import AbstractNodeModel from 'ember-osf-web/models/abstract-node';
import FileModel from 'ember-osf-web/models/file';
import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';
import RouterService from '@ember/routing/router-service';
import { task} from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import { action } from '@ember/object';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import captureException from 'ember-osf-web/utils/capture-exception';
import { tracked } from '@glimmer/tracking';

const { cedarConfig } = config;

interface Args {
    cedarMetadataRecord?: CedarMetadataRecordModel;
    cedarMetadataTemplate: CedarMetadataTemplateModel;
    redirectRoute: string;
    target: AbstractNodeModel | FileModel;
    displayArtifactViewer?: () => {};
}

export default class CedarMetadataEditor extends Component<Args> {
    @service toast!: Toast;
    @service intl!: Intl;
    @service store!: Store;
    @service router!: RouterService;

    cedarConfig = cedarConfig.editorConfig;
    isEdit = this.args.cedarMetadataRecord ? true : false;
    @tracked buttonText = this.intl.t('cedar.editor.save-draft-button');
    @tracked isValid = false;
    private cedarEmbeddableEditor?: Element | null;

    @action
    injectMetadata(): void {
        this.cedarEmbeddableEditor = document.querySelector('cedar-embeddable-editor');
        if (this.args.cedarMetadataRecord) {
            // eslint-disable-next-line
            // @ts-ignore
            this.cedarEmbeddableEditor.instanceObject = this.args.cedarMetadataRecord.metadata;
            this.validateCedarMetadata();
        }
    }

    @action
    validateCedarMetadata() {
        // eslint-disable-next-line
        // @ts-ignore
        const report = this.cedarEmbeddableEditor.dataQualityReport;
        this.isValid = report.isValid;

        this.buttonText = this.isValid ?
            this.intl.t('cedar.editor.publish-button') :
            this.intl.t('cedar.editor.save-draft-button');
    }

    @action
    cancel() {
        if (this.args.displayArtifactViewer) {
            this.args.displayArtifactViewer();
        }
    }

    @task
    @waitFor
    async save() {
        // This is because you can clear a field without it changing
        // The form can change from valid to invalid
        this.validateCedarMetadata();
        let record: CedarMetadataRecordModel;
        if (this.isEdit) {
            record = this.args.cedarMetadataRecord!;
        } else {
            record = this.store.createRecord('cedar-metadata-record');
            record.template = this.args.cedarMetadataTemplate;
            record.target = this.args.target;
        }

        record.isPublished = this.isValid;

        // eslint-disable-next-line
        // @ts-ignore
        record.metadata = this.cedarEmbeddableEditor.currentMetadata;
        try {
            await record.save();
            if ( this.isEdit && this.args.displayArtifactViewer) {
                this.args.displayArtifactViewer();
            } else {
                if ( this.args.redirectRoute === 'guid-file') {
                    await this.router.transitionTo(this.args.redirectRoute);
                } else {
                    await this.router.transitionTo(this.args.redirectRoute, record.id);
                }
            }
        } catch(error) {
            captureException(error);
            this.toast.error(this.intl.t('cedar.editor.error'));
        }
    }
}
