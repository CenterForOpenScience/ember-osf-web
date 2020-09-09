import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import ProviderModel from 'ember-osf-web/models/provider';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import template from './template';

@layout(template)
export default class RegistriesHeader extends Component {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @requiredAction onSearch!: (value: string) => void;

    providerModel?: ProviderModel;
    notBranded = true;
    localClassNameBindings = ['notBranded:RegistriesHeader'];
    today = new Date();
    showingHelp = false;
    value: string = defaultTo(this.value, '');
    searchable: number = defaultTo(this.searchable, 0);
    showHelp: boolean = defaultTo(this.showHelp, false);

    @computed('providerModel')
    get headerAriaLabel() {
        return this.providerModel ? this.providerModel.name.concat(' ', this.intl.t('registries.header.registrations'))
            : this.intl.t('registries.header.osf_registrations');
    }

    @action
    onSubmit() {
        if (this.providerModel) {
            this.analytics.click('link', `Discover - Search ${this.providerModel.name}`, this.value);
        } else {
            this.analytics.click('link', 'Discover - Search', this.value);
        }
        this.onSearch(this.value);
    }

    @action
    toggleHelp() {
        this.set('showingHelp', !this.showingHelp);
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
