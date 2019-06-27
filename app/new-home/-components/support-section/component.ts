import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { camelize } from '@ember/string';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';
import InViewport from 'ember-in-viewport/services/in-viewport.js';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';

import styles from './styles';
import template from './template';

const { featureFlagNames: { ABTesting } } = config;

@layout(template, styles)
@tagName('')
export default class SupportSection extends Component {
    @service analytics!: Analytics;
    @service features!: Features;
    @service InViewport!: InViewport;

    @alias(`features.${camelize(ABTesting.homePageVersionB)}`)
    shouldShowVersionB!: boolean;

    @computed('shouldShowVersionB')
    get version(this: SupportSection): string {
        return this.shouldShowVersionB ? 'versionB' : 'versionA';
    }

    didInsertElement(this: SupportSection, ...args: any[]) {
        // Watches the element for when it comes into view
        this._super(...args);
        const section = document.getElementById('support-section');
        const { onEnter } = this.InViewport.watchElement(section);
        onEnter(this.didEnterViewport.bind(this));
    }

    didEnterViewport() {
        // Run analytics when the component comes into view
        this.analytics.track(
            'page',
            'scroll',
            `Logged-out homepage ${this.version} - Support section`,
        );
    }

    willDestroyElement() {
        // Stop watching the element on destroy
        const section = document.getElementById('support-section');
        this.InViewport.stopWatching(section);
    }
}
