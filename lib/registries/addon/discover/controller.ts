import Store from '@ember-data/store';
// import EmberArray, { A } from '@ember/array';
import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Media from 'ember-responsive';
import { tracked } from '@glimmer/tracking';
import { OnSearchParams } from 'osf-components/components/search-page/component';

export default class Discover extends Controller.extend() {
    @service media!: Media;
    @service intl!: Intl;
    @service store!: Store;

    @tracked q? = '';
    @tracked sort? = '-relevance';
    @tracked page? = '';

    queryParams = ['q', 'page', 'sort'];

    @action
    onSearch(onSearchParams: OnSearchParams) {
        this.q = onSearchParams.q;
        this.page = onSearchParams.page;
        this.sort = onSearchParams.sort;
    }
}
