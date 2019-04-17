import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { camelize } from '@ember/string';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

import { serviceLinks } from 'ember-osf-web/const/service-links';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

const { featureFlagNames: { homePageVersionB } } = config;

@layout(template, styles)
export default class NewHome extends Component {
    @service features!: Features;

    @alias(`features.${camelize(homePageVersionB)}`)
    shouldShowVersionB!: boolean;

    @action
    search(query: string) {
        const { search } = serviceLinks;
        window.location.href = `${search}?q=${query}&page=1`;
    }
}
