import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import { tracked } from 'tracked-built-ins';

enum FilterTypes {
    STORAGE = 'additional-storage',
    CITATION_MANAGER = 'citation-manager',
    // CLOUD_COMPUTING = 'cloud-computing', // disabled because BOA is down
}
export default class GuidNodeAddonsController extends Controller {
    @service media!: Media;
    @tracked tabIndex = 0;
    @tracked activeFilterType = FilterTypes.STORAGE;

    queryParams = ['tabIndex', 'activeFilterType'];

    get isMobile() {
        return this.media.isMobile;
    }
}
