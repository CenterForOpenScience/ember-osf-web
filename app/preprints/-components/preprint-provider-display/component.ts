import Component from '@glimmer/component';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';

interface InputArgs {
    provider: PreprintProviderModel;
}

export default class PreprintProviderDisplay extends Component<InputArgs> {
    provider = this.args.provider;
}
