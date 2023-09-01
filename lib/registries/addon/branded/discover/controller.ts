import Store from '@ember-data/store';
// import EmberArray, { A } from '@ember/array';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Media from 'ember-responsive';
import { tracked } from '@glimmer/tracking';
import { OnSearchParams } from 'osf-components/components/search-page/component';
import pathJoin from 'ember-osf-web/utils/path-join';
import config from 'ember-get-config';

export default class BrandedDiscover extends Controller.extend() {
    @service media!: Media;
    @service intl!: Intl;
    @service store!: Store;

    @tracked cardSearchText? = '';
    @tracked sort? = '-relevance';
    @tracked page? = '';

    queryParams = ['cardSearchText', 'page', 'sort'];

    get defaultQueryOptions() {
        return {
            publisher: pathJoin(config.OSF.url, 'registrations', this.model.id),
        };
    }

    @action
    onSearch(onSearchParams: OnSearchParams) {
        this.cardSearchText = onSearchParams.cardSearchText;
        this.page = onSearchParams.page;
        this.sort = onSearchParams.sort;
    }
}
