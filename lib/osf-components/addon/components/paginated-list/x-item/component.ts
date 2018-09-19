import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import layout from './template';

@tagName('') // No wrapping div
export default class PaginatedRelationXItem extends Component {
    layout = layout;
}
