import Component from '@glimmer/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Media from 'ember-responsive';

import ProviderModel from 'ember-osf-web/models/provider';
import Analytics from 'ember-osf-web/services/analytics';
import { tracked } from '@glimmer/tracking';
import { requiredAction } from 'ember-osf-web/decorators/component';

interface InputArgs {
    onSearch: (value: string) => void;
    translationParent?: string;
    showHelp: false;
}

export default class BrandedHeader extends Component<InputArgs> {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service media!: Media;
    @requiredAction onSearch!: (value: string) => void;
    @tracked showingHelp = false;

    providerModel?: ProviderModel;
    notBranded = true;
    localClassNameBindings = ['notBranded:Header'];
    today = new Date();
    value = '';
    searchable = 0;

    get showHelp(): boolean {
        return this.args.showHelp;
    }

    @computed('providerModel.name', 'args.translationParent')
    get headerAriaLabel() {
        return this.providerModel ?
            this.providerModel.name.concat(' ', this.intl.t(`${this.args.translationParent}.header.registrations`))
            : this.intl.t(`${this.args.translationParent}.header.osf_registrations`);
    }

    @action
    onSubmit() {
        if (this.providerModel) {
            this.analytics.click('link', `Discover - Search ${this.providerModel.name}`, this.value);
        } else {
            this.analytics.click('link', 'Discover - Search', this.value);
        }
        this.args.onSearch(this.value);
    }

    @action
    toggleHelp() {
        this.showingHelp = !this.showingHelp;
    }

    @action
    keyPress(event: KeyboardEvent) {
        if (event.keyCode !== 13) {
            if (this.providerModel) {
                this.analytics.track('input', 'onkeyup', `Discover - Search ${this.providerModel.name}`, this.value);
            } else {
                this.analytics.track('input', 'onkeyup', 'Discover - Search', this.value);
            }
        }
    }
}
