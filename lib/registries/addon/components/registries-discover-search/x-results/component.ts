import { classNames } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import Component from '@ember/component';
import { requiredAction } from 'ember-osf-web/decorators/component';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import { SearchOptions } from 'registries/services/search';
import layout from './template';

@localClassNames('SearchResults')
@classNames('col-sm-8', 'col-xs-12')
export default class SearchResults<T> extends Component {
    static positionalParams = ['results'];

    searchOptions!: SearchOptions;
    @requiredAction onSearchOptionsUpdated!: (options: SearchOptions) => void;

    results!: T[];
    layout = layout;

    @action
    _onSearchOptionsUpdated(options: SearchOptions) {
        this.onSearchOptionsUpdated(options);
    }
}
