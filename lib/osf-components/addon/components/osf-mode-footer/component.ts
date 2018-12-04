import Component from '@ember/component';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

/**
 * @module ember-osf-web
 * @submodule components
 */

/**
 * If development mode, display a red banner in the footer
 * @class osf-mode-footer
 */
@layout(template, styles)
export default class OsfModeFooter extends Component {
    isDevMode: boolean = config.OSF.devMode;
}
