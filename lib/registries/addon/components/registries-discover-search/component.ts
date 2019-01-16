import { A } from '@ember/array';
import Component from '@ember/component';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import { SearchOptions } from 'registries/services/search';
import template from './template';

@layout(template)
export default class Discover<T> extends Component {
    results = A<T>([]);
    searchOptions!: SearchOptions;
    @requiredAction onSearchOptionsUpdated!: (options: SearchOptions) => void;
}
