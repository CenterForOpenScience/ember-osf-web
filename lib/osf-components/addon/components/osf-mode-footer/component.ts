import Component from '@ember/component';
import config from 'ember-get-config';
import styles from './styles';
import layout from './template';

/**
 * @module ember-osf-web
 * @submodule components
 */

/**
 * If development mode, display a red banner in the footer
 * @class osf-mode-footer
 */
export default class OsfModeFooter extends Component {
    layout = layout;
    styles = styles;

    isDevMode: boolean = config.OSF.devMode;
}
