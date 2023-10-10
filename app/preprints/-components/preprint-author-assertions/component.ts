import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import PreprintModel from 'ember-osf-web/models/preprint';
import Features from 'ember-feature-flags';
import ProviderModel from 'ember-osf-web/models/provider';
import { tracked } from '@glimmer/tracking';

interface InputArgs {
    preprint: PreprintModel;
    provider: ProviderModel;
    documentType: string;
}

export default class PreprintAuthorAssertions extends Component<InputArgs> {
    @service features!: Features;

    @tracked displayCoi = false;
    @tracked displayDataLinks = false;

    preprint = this.args.preprint;
    provider = this.args.provider;
    documentType = this.args.documentType;

    /*
    shouldShowSloanIcons: alias('hasSloanData'),
    shouldShowPreregLinks: alias('hasPreregLinks'),
    */

    public get shouldShowSloanIcons(): boolean {
        return this.hasSloanData();
    }

    private hasSloanData(): boolean {
        return this.hasCoi || this.hasDataLinks || this.hasPreregLinks();
    }

    public get hasCoi(): boolean {
        return this.preprint.hasCoi;
    }

    public get hasCoiStatement(): boolean {
        return typeof this.preprint.conflictOfInterestStatement === 'string';
    }

    public get hasDataLinks(): boolean {
        return typeof this.preprint.hasDataLinks === 'string';
    }

    private hasPreregLinks(): boolean {
        return typeof this.preprint.hasPreregLinks === 'string';
    }
}

