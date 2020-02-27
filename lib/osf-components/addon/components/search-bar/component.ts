import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class SearchBar extends Component {
    @service analytics!: Analytics;

    value: string = '';
    @requiredAction onSearch!: (query: string) => void;

    @action
    _onSearch(query: string) {
        this.analytics.trackFromElement(this.element, {
            name: 'Search',
            category: 'search',
            action: 'enter',
        });
        this.onSearch(query);
    }
}
