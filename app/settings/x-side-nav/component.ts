import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import Analytics from 'ember-osf-web/services/analytics';

export default class SettingsSideNav extends Component {
    @service analytics!: Analytics;
}
