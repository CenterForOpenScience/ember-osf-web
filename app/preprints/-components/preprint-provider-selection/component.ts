import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { serviceLinks } from 'ember-osf-web/const/service-links';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import RouterService from '@ember/routing/router-service';


interface InputArgs {
    allProviders: PreprintProviderModel[];
}


export default class PreprintProviderSelection extends Component<InputArgs> {
    @service router!: RouterService;

    allProviders: PreprintProviderModel[] = this.args.allProviders;
    learnMoreUrl: string = serviceLinks.preprintsSupport;
    @tracked selected_provider: PreprintProviderModel | undefined;
    @tracked previous_provider: PreprintProviderModel | undefined;

    @action
    onCreateButtonClick() {
        if (this.selected_provider !== undefined) {
            this.router.transitionTo('preprints.submit', this.selected_provider.id);
        }
    }

    @action
    updateSelectedProvider(provider: PreprintProviderModel) {
        this.previous_provider = this.selected_provider;
        this.selected_provider = provider;
    }
}
