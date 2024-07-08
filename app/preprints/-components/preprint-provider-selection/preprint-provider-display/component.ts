import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';


interface InputArgs {
    provider: PreprintProviderModel;
    updateSelectedProvider: (provider: PreprintProviderModel) => void;
    selectedProviderId: string;
}


export default class PreprintProviderDisplay extends Component<InputArgs> {
    @tracked provider: PreprintProviderModel = this.args.provider;

    public get isSelected(): boolean {
        return this.args.provider.id === this.args.selectedProviderId;
    }

    @action
    onProviderSelect(): void {
        this.args.updateSelectedProvider(this.provider);
    }
}
