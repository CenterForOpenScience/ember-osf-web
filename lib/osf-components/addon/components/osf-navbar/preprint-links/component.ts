import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CurrentUserService from 'ember-osf-web/services/current-user';
import config from 'ember-osf-web/config/environment';
import Theme from 'ember-osf-web/services/theme';

interface Args {
    onLinkClicked: () => void;
}
export default class OsfNavbarPreprintLinks extends Component<Args> {
    @service currentUser!: CurrentUserService;
    @service theme!: Theme;

    donateURL = `${config.OSF.donateUrl}`;
    supportURL = `${config.support.faqPageUrl}`;
}
