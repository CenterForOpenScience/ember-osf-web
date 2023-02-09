import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';


export default class GuidNode extends Controller {
    @service router!: RouterService;
    @service media!: Media;

    get onFilesRoute() {
        return (
            this.router.currentRouteName === 'guid-node.files.provider' ||
            this.router.currentRouteName === 'guid-node.files'
        );
    }

    get isDesktop() {
        return this.media.isDesktop;
    }
}
