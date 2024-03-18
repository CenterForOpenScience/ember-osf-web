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
    @tracked selectedProvider: PreprintProviderModel | undefined;
    @tracked previousProvider: PreprintProviderModel | undefined;

    @action
    onCreateButtonClick() {
        if (this.selectedProvider !== undefined) {
            this.router.transitionTo('preprints.submit', this.selectedProvider.id);
        }
    }

    @action
    updateSelectedProvider(provider: PreprintProviderModel) {
        this.previousProvider = this.selectedProvider;
        this.selectedProvider = provider;
    }
}
