import Component from '@ember/component';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import layout from './template';

@localClassNames('SearchResult')
export default class SearchResult<T> extends Component {
    result!: T;
    layout = layout;
}
