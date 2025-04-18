import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import CurrentUser from 'ember-osf-web/services/current-user';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {
    Filter, OnQueryParamChangeParams, ResourceTypeFilterValue,
} from 'osf-components/components/search-page/component';

export default class InstitutionDiscoverController extends Controller {
    @service currentUser!: CurrentUser;

    @tracked q?: string = '';
    @tracked sort?: string =  '-relevance';
    @tracked resourceType: ResourceTypeFilterValue = ResourceTypeFilterValue.Projects;
    @tracked activeFilters?: Filter[] = [];

    queryParams = ['q', 'sort', 'resourceType', 'activeFilters'];

    get defaultQueryOptions() {
        const identifiers = this.model.iris.join(',');
        let key = 'affiliation';
        const { resourceType } = this;
        switch (resourceType) {
        case ResourceTypeFilterValue.Files:
            key = 'isContainedBy.affiliation';
            break;
        default:
            break;
        }
        return {
            [key]: identifiers,
        };
    }

    @action
    onQueryParamChange(queryOptions: OnQueryParamChangeParams) {
        this.q = queryOptions.cardSearchText;
        this.sort = queryOptions.sort;
        this.resourceType = queryOptions.resourceType as ResourceTypeFilterValue;
        this.activeFilters = queryOptions.activeFilters;
    }
}
