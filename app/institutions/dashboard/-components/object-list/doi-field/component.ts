import Component from '@glimmer/component';

import SearchResultModel from 'ember-osf-web/models/search-result';
import { extractDoi } from 'ember-osf-web/utils/doi';

interface DoiFieldArgs {
    searchResult: SearchResultModel;
}

export default class InstitutionalObjectListDoiField extends Component<DoiFieldArgs> {
    get dois() {
        const dois = this.args.searchResult.doi;
        return dois.map((doi: string) => ({ fullLink: doi, displayText: extractDoi(doi) }));
    }
}
