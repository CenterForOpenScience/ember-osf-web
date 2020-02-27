import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { localClassNames } from 'ember-css-modules';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('span')
@localClassNames('SortButton')
export default class SortButton extends Component {
    @service analytics!: Analytics;

    sortBy?: string;

    @computed('sortBy')
    get sortByDesc(): string {
        return `-${this.sortBy}`;
    }
}
