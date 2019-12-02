import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

import Analytics from 'ember-osf-web/services/analytics';

export default class PageNotFound extends Controller {
    @service analytics!: Analytics;
}
