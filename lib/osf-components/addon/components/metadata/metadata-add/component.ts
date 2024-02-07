import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import config from 'ember-osf-web/config/environment';
import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';

interface AddArgs {
    templates: CedarMetadataTemplateModel[];
    selectedTemplate: CedarMetadataTemplateModel;
}

export default class MetadataAdd extends Component<AddArgs> {
    @service media!: Media;
    supportEmail = config.support.supportEmail;

    get isMobile() {
        return this.media.isMobile;
    }
}
