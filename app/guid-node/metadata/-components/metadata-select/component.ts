import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';
import { action } from '@ember/object';

interface TabArgs {
    template: [CedarMetadataTemplateModel];
}


export default class MetadataSelect extends Component<TabArgs> {
    @service media!: Media;

    template = this.args.template;

    @action
    // eslint-disable-next-line
    selectTemplate() { }

    get isMobile() {
        return this.media.isMobile;
    }
}
