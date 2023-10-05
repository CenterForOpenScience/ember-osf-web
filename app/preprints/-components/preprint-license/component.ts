import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import PreprintModel from 'ember-osf-web/models/preprint';

interface InputArgs {
    preprint: PreprintModel;
}

export default class PreprintLicense extends Component<InputArgs> {
    preprint = this.args.preprint;
    @tracked showLicenseText = false;

    @action
    toggleLicenseText(): void {
        this.showLicenseText = !this.showLicenseText;
    }
}
