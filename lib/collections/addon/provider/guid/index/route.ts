import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import Theme from 'ember-osf-web/services/theme';

export default class GuidIndex extends Route {
    @service theme!: Theme;

    beforeModel() {
        this.transitionTo(this.theme.prefixRoute('page-not-found'));
    }
}
