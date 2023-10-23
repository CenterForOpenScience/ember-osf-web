import Store from '@ember-data/store';
// import EmberArray, { A } from '@ember/array';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Media from 'ember-responsive';
import { tracked } from '@glimmer/tracking';
import { Filter, OnQueryParamChangeParams } from 'osf-components/components/search-page/component';
import pathJoin from 'ember-osf-web/utils/path-join';
import config from 'ember-osf-web/config/environment';
export default class BrandedDiscover extends Controller.extend() {
    @service media!: Media;
    @service intl!: Intl;
    @service store!: Store;

    @tracked cardSearchText? = '';
    @tracked sort?= '-relevance';
    @tracked activeFilters?: Filter[] = [];

    queryParams = ['cardSearchText', 'sort', 'activeFilters'];

    get defaultQueryOptions() {
        return {
            publisher: pathJoin(config.OSF.url, 'registries', this.model.id),
        };
    }

    @action
    onQueryParamChange(onQueryParamChangeParams: OnQueryParamChangeParams) {
        this.cardSearchText = onQueryParamChangeParams.cardSearchText;
        this.sort = onQueryParamChangeParams.sort;
        this.activeFilters = onQueryParamChangeParams.activeFilters;
    }
}
