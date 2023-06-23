import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Intl from 'ember-intl/services/intl';
import Media from 'ember-responsive';

export default class SearchController extends Controller {
    @service intl!: Intl;
    @service store!: Store;
    @service media!: Media;
    @service toast!: Toastr;

    @tracked q?: string = '';
    @tracked seachBoxText?: string = '';

    queryParams = ['q', 'page', 'sort', 'resourceType'];

    get showSidePanelToggle() {
        return this.media.isMobile || this.media.isTablet;
    }

    @action
    ingestQueryParams() {
        const { q } = this;
        if (q) {
            this.seachBoxText = q;
        }
    }
}
