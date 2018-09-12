import { A } from '@ember/array';
import Component from '@ember/component';
import requiredAction from 'ember-osf-web/decorators/required-action';
import { SearchOptions } from 'registries/services/search';
import layout from './template';

export default class Discover<T> extends Component {
    results = A<T>([]);
    layout = layout;
    searchOptions!: SearchOptions;
    @requiredAction onSearchOptionsUpdated!: (options: SearchOptions) => void;
}
