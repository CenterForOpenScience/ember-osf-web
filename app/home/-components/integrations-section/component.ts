import { tagName } from '@ember-decorators/component';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { camelize } from '@ember/string';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';
import InViewport from 'ember-in-viewport/services/in-viewport.js';

import Analytics from 'ember-osf-web/services/analytics';

const { featureFlagNames: { ABTesting } } = config;

@tagName('')
export default class IntegrationsSection extends Component {
    @service analytics!: Analytics;
    @service features!: Features;
    @service InViewport!: InViewport;

    @alias(`features.${camelize(ABTesting.homePageVersionB)}`)
    shouldShowVersionB!: boolean;
}
