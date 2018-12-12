import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import template from './template';

@layout(template)
export default class RegistriesServiceList extends Component {
    @service analytics!: Analytics;
}
