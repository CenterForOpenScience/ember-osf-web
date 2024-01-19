import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import config from 'ember-osf-web/config/environment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import RouterService from '@ember/routing/router-service';
import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';
import Intl from 'ember-intl/services/intl';

export default class GuidMetadataAdd extends Controller {
    @service media!: Media;
    @service router!: RouterService;
    @service intl!: Intl;

    supportEmail = config.support.supportEmail;

    @tracked displaySelectionOptions = true;
    @tracked selectedTemplate?: CedarMetadataTemplateModel;
    @tracked tabTitle = this.getTabTitle();

    @action
    selectTemplate(cedarMetadataTemplate: CedarMetadataTemplateModel): void {
        this.displaySelectionOptions = false;
        this.selectedTemplate = cedarMetadataTemplate;
        this.updateTitle();
    }

    @action
    closeCedarEditor(): void {
        this.displaySelectionOptions = true;
        this.selectedTemplate = undefined;
        this.updateTitle();
    }

    private getTabTitle(): string {
        // eslint-disable-next-line max-len
        const translation = this.displaySelectionOptions ? 'metadata.add-flow.tab-title-select' : 'metadata.add-flow.tab-title-add';
        return `${this.intl.t('metadata.tab-title')} | ${this.intl.t(translation)}`;
    }

    private updateTitle(): void {
        this.tabTitle = this.getTabTitle();
    }

    get isMobile() {
        return this.media.isMobile;
    }
}
