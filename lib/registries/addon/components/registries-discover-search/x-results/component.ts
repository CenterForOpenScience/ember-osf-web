import { classNames } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import Component from '@ember/component';
import { localClassNames } from 'ember-css-modules';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import { SearchOptions } from 'registries/services/search';
import template from './template';

@layout(template)
@localClassNames('SearchResults')
@classNames('col-sm-8', 'col-xs-12')
export default class SearchResults<T> extends Component {
    static positionalParams = ['results'];

    searchOptions!: SearchOptions;
    @requiredAction onSearchOptionsUpdated!: (options: SearchOptions) => void;

    results!: T[];

    @action
    _onSearchOptionsUpdated(options: SearchOptions) {
        this.onSearchOptionsUpdated(options);
    }
}
