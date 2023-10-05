import Component from '@glimmer/component';
import PreprintModel from 'ember-osf-web/models/preprint';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import { extractDoi } from 'ember-osf-web/utils/doi';

interface InputArgs {
    preprint: PreprintModel;
    provider: PreprintProviderModel;
}

export default class PreprintDOI extends Component<InputArgs> {
    preprint = this.args.preprint;
    provider = this.args.provider;

    documentType = this.provider.documentType.singular;

    constructor(owner: any, args: any) {
        super(owner, args);
    }

    get preprintDoi(): string {
        return extractDoi(this.preprint.preprintDoiUrl) || '';
    }
}
