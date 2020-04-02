import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import template from './template';

@layout(template)
export default class RegistriesHeader extends Component {
    @service analytics!: Analytics;
    @requiredAction onSearch!: (value: string) => void;

    notBranded = true;
    localClassNameBindings = ['notBranded:RegistriesHeader'];
    today = new Date();
    showingHelp = false;
    value: string = defaultTo(this.value, '');
    searchable: number = defaultTo(this.searchable, 0);
    showHelp: boolean = defaultTo(this.showHelp, false);

    _onSearch() {
        this.analytics.click('link', 'Index - Search', this.value);
        this.onSearch(this.value);
    }

    @action
    toggleHelp() {
        this.set('showingHelp', !this.showingHelp);
    }

    @action
    onClick() {
        this._onSearch();
    }

    @action
    keyDown(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            this._onSearch();
        }
    }
}
