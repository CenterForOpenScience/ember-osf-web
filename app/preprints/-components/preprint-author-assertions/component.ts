import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import PreprintModel from 'ember-osf-web/models/preprint';
import Features from 'ember-feature-flags';
import ProviderModel from 'ember-osf-web/models/provider';
import { tracked } from '@glimmer/tracking';
import Media from 'ember-responsive';

interface InputArgs {
    preprint: PreprintModel;
    provider: ProviderModel;
    documentType: string;
}

export default class PreprintAuthorAssertions extends Component<InputArgs> {
    @service features!: Features;
    @service intl!: Intl;
    @service media!: Media;

    @tracked displayCoi = false;
    @tracked displayDataLinks = false;
    @tracked displayPreregLinks = false;

    preprint = this.args.preprint;
    provider = this.args.provider;
    documentType = this.args.documentType;

    public get availableDataLinksMessage(): string {
        const prefix = 'preprints.detail.author-assertions.available.';
        const suffix = this.preprint.hasDataLinks;
        return this.intl.t(`${prefix}${suffix}`);
    }

    public get availablePreregLinksMessage(): string {
        const prefix = 'preprints.detail.author-assertions.available.';
        const suffix = this.preprint.hasPreregLinks;
        return this.intl.t(`${prefix}${suffix}`);

    }

    public get shouldShowSloanIcons(): boolean {
        return this.hasSloanData();
    }

    private hasSloanData(): boolean {
        return this.hasCoi || this.hasDataLinks || this.hasPreregLinks;
    }

    public get hasCoi(): boolean {
        return this.preprint.hasCoi !== null;
    }

    public get isCoiTrue(): boolean {
        return this.preprint.hasCoi;
    }

    public get hasCoiStatement(): boolean {
        return typeof this.preprint.conflictOfInterestStatement === 'string';
    }

    public get hasDataLinks(): boolean {
        return typeof this.preprint.hasDataLinks === 'string';
    }

    public get hasPreregLinks(): boolean {
        return typeof this.preprint.hasPreregLinks === 'string';
    }

    get isMobile() {
        return this.media.isMobile;
    }
}

