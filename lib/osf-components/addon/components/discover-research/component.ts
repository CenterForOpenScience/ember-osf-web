import { action } from '@ember-decorators/object';
import Component from '@ember/component';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class DiscoverResearch extends Component {
    value: string = '';
    version: string = defaultTo(this.version, 'versionA');
    @requiredAction onSearch!: (query: string) => void;

    @action
    _onSearch(this: DiscoverResearch, query: string) {
        this.onSearch(query);
    }
}
