import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import Theme from 'ember-osf-web/services/theme';

export default class Preprints extends Route {
    @service theme!: Theme;

    deactivate() {
        this.theme.reset();
    }
}
