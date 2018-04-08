import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'ember-get-config';

/**
 * @module ember-osf-web
 * @submodule components
 */

/**
 * Display copyright information as a footer
 * @class osf-copyright
 */
export default class OsfCopyright extends Component {
    @service analytics;

    currentYear: number = (new Date()).getUTCFullYear();

    constructor() {
        super();
        Object.assign(this, config.signUpPolicy);
    }
}
