import Component from '@glimmer/component';
import PreprintModel from 'ember-osf-web/models/preprint';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import { extractDoi } from 'ember-osf-web/utils/doi';

interface InputArgs {
    preprint: PreprintModel;
    provider: PreprintProviderModel;
}

export default class PreprintAbstract extends Component<InputArgs> {
    preprint = this.args.preprint;
    provider = this.args.provider;

    documentType = this.provider.documentType.singular;

    get preprintDoi(): string {
        return extractDoi(this.preprint.preprintDoiUrl) || '';
    }
}
