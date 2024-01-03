import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import config from 'ember-osf-web/config/environment';

export default class GuidMetadataAdd extends Controller {
    @service media!: Media;

    supportEmail = config.support.supportEmail;

    get isMobile() {
        return this.media.isMobile;
    }
}
