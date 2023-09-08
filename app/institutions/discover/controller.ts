import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import CurrentUser from 'ember-osf-web/services/current-user';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

import { OnSearchParams, ResourceTypeFilterValue } from 'osf-components/components/search-page/component';

export default class InstitutionDiscoverController extends Controller {
    @service currentUser!: CurrentUser;

    @tracked cardSearchText?: string = '';
    @tracked sort?: string =  '-relevance';
    @tracked resourceType?: ResourceTypeFilterValue | null = null;

    queryParams = ['cardSearchText', 'sort', 'resourceType'];

    get defaultQueryOptions() {
        const identifiers = [this.model.rorIri, this.model.iri, this.model.links.self].filter(Boolean).join(',');
        return {
            affiliation: identifiers,
            'creator,affiliation': identifiers,
            'isContainedby,affiliation': identifiers,
        };
    }

    @action
    onSearch(queryOptions: OnSearchParams) {
        this.cardSearchText = queryOptions.cardSearchText;
        this.sort = queryOptions.sort;
        this.resourceType = queryOptions.resourceType;
    }
}
