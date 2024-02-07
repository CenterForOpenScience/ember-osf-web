import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import config from 'ember-osf-web/config/environment';
import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import FileModel from 'ember-osf-web/models/file';
import AbstractNodeModel from 'ember-osf-web/models/abstract-node';

interface AddArgs {
    templates: CedarMetadataTemplateModel[];
    selectedTemplate: CedarMetadataTemplateModel;
    target: AbstractNodeModel | FileModel;
}

export default class MetadataAdd extends Component<AddArgs> {
    @service media!: Media;
    @service router!: RouterService;

    supportEmail = config.support.supportEmail;

    get isMobile() {
        return this.media.isMobile;
    }

    @action
    public async cancel(): Promise<void> {
        if (this.args.target.modelName === 'node') {
            await this.router.transitionTo('guid-node.metadata', this.args.target.id);
        } else if (this.args.target.modelName === 'registration') {
            await this.router.transitionTo('registries.overview.metadata', this.args.target.id);
        } else {
            await this.router.transitionTo('guid-file', this.args.target.id);
        }
    }
}
