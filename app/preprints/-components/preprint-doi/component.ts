import Component from '@glimmer/component';
import PreprintModel from 'ember-osf-web/models/preprint';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';

interface InputArgs {
    preprint: PreprintModel;
    provider: PreprintProviderModel;
    isReview: boolean;
}

export default class PreprintAbstract extends Component<InputArgs> {
    provider = this.args.provider;

    review = this.args.isReview || false;

    documentType = this.provider.documentType.singular;
}
