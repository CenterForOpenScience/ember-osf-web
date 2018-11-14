import Component from '@ember/component';
import { localClassNames } from 'ember-css-modules';
import layout from './template';

@localClassNames('SearchResult')
export default class SearchResult<T> extends Component {
    result!: T;
    layout = layout;
}
