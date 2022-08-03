import Component from '@ember/component';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';

import template from './template';

@layout(template)
export default class RegistriesServiceList extends Component {
    @service analytics!: Analytics;
    assetsPrefix = config.assetsPrefix;
}
