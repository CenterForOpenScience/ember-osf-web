import { tagName } from '@ember-decorators/component';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { camelize } from '@ember/string';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

const { featureFlagNames: { ABTesting } } = config;

@tagName('')
export default class IntegrationsSection extends Component {
    @service features!: Features;

    @alias(`features.${camelize(ABTesting.homePageHeroTextVersionB)}`)
    shouldShowVersionB!: boolean;
}
