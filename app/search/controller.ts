<<<<<<< HEAD
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
=======
import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Intl from 'ember-intl/services/intl';
import Media from 'ember-responsive';
>>>>>>> 5b26a1b4f (Moved Search page to OSF components.)

export default class SearchController extends Controller {
    @tracked q?: string = '';
    @tracked sort?: string =  '-relevance';
    @tracked resourceType?: string =  'All';

<<<<<<< HEAD
    queryParams = ['q', 'page', 'sort', 'resourceType'];

    @action
    onSearch(queryOptions: Record<string, string>) {
        this.q = queryOptions.q;
        this.sort = queryOptions.sort;
        this.resourceType = queryOptions.resourceType;
=======
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
>>>>>>> 5b26a1b4f (Moved Search page to OSF components.)
    }
}
