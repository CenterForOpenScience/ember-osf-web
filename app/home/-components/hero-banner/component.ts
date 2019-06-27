import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { camelize } from '@ember/string';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';
import InViewport from 'ember-in-viewport/services/in-viewport.js';

import { serviceLinks } from 'ember-osf-web/const/service-links';
import Analytics from 'ember-osf-web/services/analytics';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

const { featureFlagNames: { ABTesting } } = config;

@layout(template, styles)
@tagName('')
export default class NewHome extends Component {
    @service analytics!: Analytics;
    @service features!: Features;
    @service InViewport!: InViewport;

    @alias(`features.${camelize(ABTesting.homePageVersionB)}`)
    shouldShowVersionB!: boolean;

    @computed('shouldShowVersionB')
    get version(this: NewHome): string {
        return this.shouldShowVersionB ? 'versionB' : 'versionA';
    }

    didInsertElement(this: NewHome, ...args: any[]) {
        // Watches the element for when it comes into view
        this._super(...args);
        const section = document.getElementById('hero-section');
        const { onEnter } = this.InViewport.watchElement(section);
        onEnter(this.didEnterViewport.bind(this));
    }

    didEnterViewport() {
        // Run analytics when the component comes into view
        this.analytics.track(
            'page',
            'scroll',
            `Logged-out homepage ${this.version} - Hero Banner`,
        );
    }

    willDestroyElement() {
        // Stop watching the element on destroy
        const section = document.getElementById('hero-section');
        this.InViewport.stopWatching(section);
    }

    @action
    search(query: string) {
        const { search } = serviceLinks;
        this.analytics.track('search', 'enter', `Logged-out homepage ${this.version} - Search`);
        window.location.href = `${search}?q=${query}&page=1`;
    }
}
