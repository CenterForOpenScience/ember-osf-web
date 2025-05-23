import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';

export default class GuidNodeAddonsController extends Controller {
    @service media!: Media;

    get isMobile() {
        return this.media.isMobile;
    }
}
