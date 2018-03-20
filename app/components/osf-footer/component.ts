import Component from '@ember/component';
import config from 'ember-get-config';
import { serviceLinks } from 'ember-osf-web/const/service-links';

export default class OsfFooter extends Component {
    serviceLinks = serviceLinks;
    supportEmail: string = config.support.supportEmail;
}
