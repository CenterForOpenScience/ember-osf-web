import Component from '@glimmer/component';

import SearchResultModel from 'ember-osf-web/models/search-result';

interface TextFieldArgs {
    searchResult: SearchResultModel;
    getterFunction: (searchResult: SearchResultModel) => string;
}

export default class InstitutionalObjectListTextField extends Component<TextFieldArgs> {
    get value() {
        if (this.args.getterFunction) {
            return this.args.getterFunction(this.args.searchResult);
        }
        return '';
    }
}
