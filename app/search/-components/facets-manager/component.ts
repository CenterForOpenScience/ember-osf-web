import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import IntlService from 'ember-intl/services/intl';

import MetadataPropertySearchModel from 'ember-osf-web/models/metadata-property-search';

export interface Filter {
    key: string;
    value: string;
}

interface FacetsManagerArgs {
    propertySearch: MetadataPropertySearchModel;
    activeFilters: Filter[];
    recordSearchText: string;
    doSearch: () => void;
}

export default class FacetsManager extends Component<FacetsManagerArgs> {
    @service intl!: IntlService;
    @service toast!: Toastr;

    get filterableProperties() {
        if (!this.args.propertySearch) {
            return [];
        }
        return this.args.propertySearch.get('searchResultPage');
    }

    @action
    toggleFilter(filter: Filter) {
        const filterIndex = this.args.activeFilters.findIndex(f => f.key === filter.key && f.value === filter.value);
        if (filterIndex > -1) {
            this.args.activeFilters.removeAt(filterIndex);
        } else {
            this.args.activeFilters.pushObject(filter);
        }
        this.args.doSearch();
    }
}
