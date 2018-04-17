import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'ember-get-config';
import { serviceLinks } from 'ember-osf-web/const/service-links';

export default class OsfFooter extends Component {
    serviceLinks = serviceLinks;
    supportEmail: string = config.support.supportEmail;
    @service analytics;
    currentYear: number = (new Date()).getUTCFullYear();

    constructor() {
        super();
        Object.assign(this, config.signUpPolicy);
        Object.assign(this, config.footerLinks);
    }
}
