import { action } from '@ember-decorators/object';
import Component from '@ember/component';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class SearchBar extends Component {
    value: string = '';
    @requiredAction onSearch!: (query: string) => void;

    @action
    _onSearch(query: string) {
        this.onSearch(query);
    }
}
