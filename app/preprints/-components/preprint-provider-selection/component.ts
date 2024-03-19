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
    @tracked selectedProviderId: string | undefined;

    public get isDisabled(): boolean {
        return this.selectedProvider === undefined;
    }

    @action
    onCreateButtonClick(): void {
        if (this.selectedProvider !== undefined) {
            this.router.transitionTo('preprints.submit', this.selectedProvider.id);
        }
    }

    @action
    updateSelectedProvider(provider: PreprintProviderModel): void {
        this.selectedProvider = provider;
        this.selectedProviderId = provider.id;
    }
}
