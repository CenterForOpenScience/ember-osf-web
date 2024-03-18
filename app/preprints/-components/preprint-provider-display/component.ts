import { action } from '@ember/object';
import Component from '@glimmer/component';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';


interface InputArgs {
    provider: PreprintProviderModel;
    updateSelectedProvider: (provider: PreprintProviderModel) => void;
}


export default class PreprintProviderDisplay extends Component<InputArgs> {
    provider: PreprintProviderModel = this.args.provider;

    @action
    onProviderSelect() {
        this.args.updateSelectedProvider(this.provider);
    }
}
