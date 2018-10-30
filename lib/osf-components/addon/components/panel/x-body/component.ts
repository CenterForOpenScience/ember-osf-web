import { layout, tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import template from './template';

@layout(template)
@tagName('')
export default class PanelBody extends Component {
}
