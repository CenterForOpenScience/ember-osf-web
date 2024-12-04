import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import PreprintModel from 'ember-osf-web/models/preprint';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';

interface InputArgs {
    versions: PreprintModel[];
    provider: PreprintProviderModel;
}

export default class PreprintAbstract extends Component<InputArgs> {
    provider = this.args.provider;
    documentType = this.provider.documentType.singularCapitalized;

    @tracked selectedVersion = this.args.versions[0];

    @action
    selectVersion(version: PreprintModel) {
        this.selectedVersion = version;
    }
}
