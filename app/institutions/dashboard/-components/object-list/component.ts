import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import InstitutionModel from 'ember-osf-web/models/institution';

interface ObjectListColumn {
    name: string;
    valuePath: string;
}

interface InstitutionalObjectListArgs {
    institution: InstitutionModel;
    defaultQueryOptions: Record<string, any>;
    columns: ObjectListColumn[];
}

export default class InstitutionalObjectList extends Component<InstitutionalObjectListArgs> {
    @tracked filterObject = {}; // TODO: ENG-6183 Implement filter and type this
    @tracked page = ''; // TODO: ENG-6184 Implement pagination
    @tracked sort = '-relevance'; // TODO: ENG-6184 Implement sorting

    get queryOptions() {
        return {
            ...this.args.defaultQueryOptions,
            // TODO: ENG-6183 Implement filter
            // chance that this may overwrite the defaultQueryOptions.check SearchPageComponent for reference
            cardSearchFilter: this.filterObject,
            'page[cursor]': this.page,
            'page[size]': 10, // TODO: ENG-6184 Implement pagination
            sort: this.sort,
        };
    }
}
