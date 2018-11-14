import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { localClassNames } from 'ember-css-modules';
import Analytics from 'ember-osf-web/services/analytics';
import styles from './styles';
import layout from './template';

@tagName('span')
@localClassNames('SortButton')
export default class SortButton extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;

    sortBy?: string;

    @computed('sortBy')
    get sortByDesc(): string {
        return `-${this.sortBy}`;
    }
}
