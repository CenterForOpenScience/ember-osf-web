import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';

import Analytics from 'ember-osf-web/services/analytics';

export default class RegistriesServiceList extends Component {
    @service analytics!: Analytics;
    assetsPrefix = config.assetsPrefix;
}
