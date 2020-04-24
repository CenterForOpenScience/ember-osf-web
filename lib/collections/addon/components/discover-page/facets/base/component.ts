import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import { requiredAction } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';

import { FacetContext } from '../../component';

export default class Base extends Component {
    @service analytics!: Analytics;

    @service theme!: Theme;

    context: FacetContext = this.context;

    filterReplace: object = this.filterReplace;

    @requiredAction filterChanged!: () => void;

    @action
    updateFilters(item: string) {
        this.context.updateFilters(item);
    }
}
