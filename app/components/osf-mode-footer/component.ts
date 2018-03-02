import Component from '@ember/component';
import config from 'ember-get-config';

/**
 * @module ember-osf-web
 * @submodule components
 */

/**
 * If development mode, display a red banner in the footer
 * @class osf-mode-footer
 */
export default class OsfModeFooter extends Component {
    isDevMode: boolean = config.OSF.backend !== 'prod';
}
