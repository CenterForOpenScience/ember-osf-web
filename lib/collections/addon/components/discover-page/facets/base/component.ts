import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';

import { FacetContext } from '../../component';

export default class Base extends Component {
    @service analytics!: Analytics;
    @service theme!: Theme;

    context: FacetContext = this.context;
    filterReplace: object = this.filterReplace;

    filterChanged() {
        assert('You should pass in a closure action: filterChanged');
    }

    @action
    updateFilters(item: string) {
        this.context.updateFilters(item);
    }
}
