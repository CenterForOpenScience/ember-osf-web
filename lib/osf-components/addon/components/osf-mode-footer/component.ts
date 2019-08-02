import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import RouterService from '@ember/routing/router-service';
import { underscore } from '@ember/string';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import styles from './styles';
import template from './template';

/**
 * @module ember-osf-web
 * @submodule components
 */

/**
 * If development mode, display a red banner in the footer
 *
 * TODO: move to a 'dev-tools' in-repo addon or package, exclude from prod builds
 *
 * @class osf-mode-footer
 */
@layout(template, styles)
export default class OsfModeFooter extends Component {
    @service analytics!: Analytics;
    @service features!: Features;
    @service router!: RouterService;

    showDevBanner = config.showDevBanner;
    showModal = false;
    showUrlInput = false;
    url: string = '/';

    get featureList() {
        return this.features.flags.map(flag => underscore(flag)).sort();
    }

    @action
    toggleFeature(flagName: string) {
        if (this.features.isEnabled(flagName)) {
            this.features.disable(flagName);
        } else {
            this.features.enable(flagName);
        }
    }

    @action
    transitionToUrl() {
        this.router.transitionTo(this.url);
    }
}
