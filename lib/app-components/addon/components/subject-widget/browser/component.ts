import { action } from '@ember-decorators/object';
import { not } from '@ember-decorators/object/computed';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class SubjectsBrowser extends Component {
    inSearchMode: boolean = defaultTo(this.inSearchMode, false);

    @not('inSearchMode') inBrowserMode!: boolean;

    @action
    togglePanes() {
        this.toggleProperty('inSearchMode');
    }
}
