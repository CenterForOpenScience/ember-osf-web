import { action } from '@ember/object';
import Component from '@glimmer/component';
import config from 'ember-osf-web/config/environment';

const { cedarConfig } = config;

interface Args {
    instanceObject: any;
    templateObject: any;
}

export default class CedarMetadataEditor extends Component<Args> {
    @action
    save() {
        /*
        const cee = document.querySelector('cedar-embeddable-editor');
        console.log(cee.metadata);
        */
    }
    cedarConfig = cedarConfig;
}
