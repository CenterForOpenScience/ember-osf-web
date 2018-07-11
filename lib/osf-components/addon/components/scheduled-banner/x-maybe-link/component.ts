import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import Analytics from 'ember-osf-web/services/analytics';
import layout from './template';

export default class BannerMaybeLink extends Component {
    @service analytics!: Analytics;
    layout = layout;

    // Required argument
    href!: string;
}
