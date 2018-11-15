import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import template from './template';

@layout(template)
@tagName('') // No wrapping div
export default class PaginatedRelationXItem extends Component {
}
