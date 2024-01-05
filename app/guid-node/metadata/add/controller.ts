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
    selectTemplate(cedarId: string): void {
        this.displaySelectionOptions = false;

        // eslint-disable-next-line max-len
        const selectedTemplate = this.model.templates.filter((template: CedarMetadataTemplateModel) =>  cedarId === template.cedarId);

        if (selectedTemplate) {
            this.selectedTemplate = selectedTemplate.pop();
        } else {
            this.router.transitionTo('not-found', `${this.model.guidNode.id}/metadata`);
        }
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
