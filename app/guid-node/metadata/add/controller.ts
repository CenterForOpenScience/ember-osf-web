import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import config from 'ember-osf-web/config/environment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import RouterService from '@ember/routing/router-service';
import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';

export default class GuidMetadataAdd extends Controller {
    @service media!: Media;
    @service router!: RouterService;

    supportEmail = config.support.supportEmail;

    @tracked displaySelectionOptions = true;
    @tracked selectedTemplate?: CedarMetadataTemplateModel;

    @action
    selectTemplate(cedarMetadataTemplate: CedarMetadataTemplateModel): void {
        this.displaySelectionOptions = false;

        // eslint-disable-next-line max-len
        this.selectedTemplate = cedarMetadataTemplate;
    }

    @action
    closeCedarEditor(): void {
        this.displaySelectionOptions = true;
        this.selectedTemplate = undefined;
    }

    get isMobile() {
        return this.media.isMobile;
    }
}
