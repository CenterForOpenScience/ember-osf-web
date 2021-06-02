import Component from '@ember/component';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';

import { serviceLinks } from 'ember-osf-web/const/service-links';
import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class OsfFooter extends Component {
    @service analytics!: Analytics;

    serviceLinks = serviceLinks;
    supportEmail = config.support.supportEmail;
    currentYear = (new Date()).getUTCFullYear();

    constructor(properties: object) {
        super(properties);
        Object.assign(this, config.signUpPolicy, config.footerLinks);
    }
}
