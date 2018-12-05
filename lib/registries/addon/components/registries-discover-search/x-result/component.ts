import Component from '@ember/component';
import { localClassNames } from 'ember-css-modules';

import { layout } from 'ember-osf-web/decorators/component';
import template from './template';

@layout(template)
@localClassNames('SearchResult')
export default class SearchResult<T> extends Component {
    result!: T;
}
