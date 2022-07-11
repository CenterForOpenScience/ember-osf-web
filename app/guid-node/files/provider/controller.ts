import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';

import CurrentUser from 'ember-osf-web/services/current-user';

export default class GuidNodeFilesProvider extends Controller {
    @service media!: Media;
    @service currentUser!: CurrentUser;

    get isDesktop() {
        return this.media.isDesktop;
    }
}
