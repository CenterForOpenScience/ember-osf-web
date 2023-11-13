import { action } from '@ember/object';
import Component from '@glimmer/component';
// import { task } from 'ember-concurrency';
// import { tracked } from 'tracked-built-ins';
import config from 'ember-osf-web/config/environment';

const { cedarConfig } = config;

interface Args {
    instanceObj: any;
    templateOjb: any;
}

export default class CedarMetadataEditor extends Component<Args> {
    @action
    save() {
        const cee = document.querySelector('cedar-embeddable-editor');
        console.log(cee.metadata);
    }
    cedarConfig = cedarConfig;
}
