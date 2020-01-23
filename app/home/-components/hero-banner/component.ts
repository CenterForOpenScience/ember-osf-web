import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

import { serviceLinks } from 'ember-osf-web/const/service-links';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

const { featureFlagNames: { ABTesting } } = config;

@layout(template, styles)
@tagName('')
export default class HomeHeroBanner extends Component {
    @service features!: Features;

    @alias(`features.${camelize(ABTesting.homePageHeroTextVersionB)}`)
    shouldShowVersionB!: boolean;

    @action
    search(query: string) {
        const { search } = serviceLinks;
        window.location.href = `${search}?q=${query}&page=1`;
    }
}
