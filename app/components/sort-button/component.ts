import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Analytics from 'ember-osf-web/services/analytics';

@tagName('span')
export default class SortButton extends Component.extend({
    localClassNames: 'SortButton',
}) {
    @service analytics!: Analytics;

    sortBy?: string;

    @computed('sortBy')
    get sortByDesc(): string {
        return `-${this.sortBy}`;
    }
}
