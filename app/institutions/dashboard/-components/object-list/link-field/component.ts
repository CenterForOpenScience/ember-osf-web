import Component from '@glimmer/component';

import SearchResultModel from 'ember-osf-web/models/search-result';

interface LinkFieldArgs {
    searchResult: SearchResultModel;
    getHref: (searchResult: SearchResultModel) => string;
    getLinkText: (searchResult: SearchResultModel) => string;
}

export default class InstitutionalObjectListLinkField extends Component<LinkFieldArgs> {
    get href() {
        const { getHref, searchResult } = this.args;
        if (getHref) {
            return getHref(searchResult);
        }
        return '';
    }

    get linkText() {
        const { getLinkText, searchResult } = this.args;
        if (getLinkText) {
            return getLinkText(searchResult);
        }
        return '';
    }
}
