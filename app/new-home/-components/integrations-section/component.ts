import { tagName } from '@ember-decorators/component';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { camelize } from '@ember/string';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

const { featureFlagNames: { ABTesting } } = config;

@layout(template, styles)
@tagName('')
export default class IntegrationsSection extends Component {
    @service features!: Features;

    @alias(`features.${camelize(ABTesting.homePageVersionB)}`)
    shouldShowVersionB!: boolean;
}
