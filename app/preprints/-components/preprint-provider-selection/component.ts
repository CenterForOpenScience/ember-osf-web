import Component from '@glimmer/component';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import { serviceLinks } from 'ember-osf-web/const/service-links';

interface InputArgs {
    allProviders: PreprintProviderModel[];
}

export default class PreprintProviderSelection extends Component<InputArgs> {

    allProviders = this.args.allProviders;
    learnMoreUrl = serviceLinks.preprintsSupport;
}
