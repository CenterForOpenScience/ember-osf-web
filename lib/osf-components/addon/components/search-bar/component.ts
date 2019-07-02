import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import Analytics from 'ember-osf-web/services/analytics';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class SearchBar extends Component {
    @service analytics!: Analytics;

    value: string = '';
    @requiredAction onSearch!: (query: string) => void;

    @action
    _onSearch(query: string) {
        this.analytics.track('search', 'enter', 'Search');
        this.onSearch(query);
    }
}
