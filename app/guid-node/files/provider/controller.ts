import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';

export default class GuidNodeFilesProvider extends Controller {
    @service media!: Media;

    get isDesktop() {
        return this.media.isDesktop;
    }
}
