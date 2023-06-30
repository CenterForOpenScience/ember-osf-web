import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Media from 'ember-responsive';

export default class SearchController extends Controller {
    @service media!: Media;

    @tracked q?: string = '';
    @tracked sort?: string =  '-relevance';
    @tracked resourceType?: string =  'All';

    queryParams = ['q', 'page', 'sort', 'resourceType'];

    get showSidePanelToggle() {
        return this.media.isMobile || this.media.isTablet;
    }

    @action
    onSearch(queryOptions: Record<string, string>) {
        this.q = queryOptions.q;
        this.sort = queryOptions.sort;
        this.resourceType = queryOptions.resourceType;
    }
}
