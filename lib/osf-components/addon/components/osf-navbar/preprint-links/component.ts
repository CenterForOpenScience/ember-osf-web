import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CurrentUserService from 'ember-osf-web/services/current-user';
import config from 'ember-osf-web/config/environment';

interface Args {
    onLinkClicked: () => void;
}
export default class OsfNavbarPreprintLinks extends Component<Args> {
    @service currentUser!: CurrentUserService;

    donateURL = `${config.OSF.donateUrl}`;
    supportURL = `${config.support.faqPageUrl}`;
}
