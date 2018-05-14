import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Analytics from 'ember-osf-web/services/analytics';

import { localClassNames } from 'ember-osf-web/decorators/css-modules';

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
