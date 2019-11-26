import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';

import template from './template';

@layout(template)
@tagName('')
export default class PanelHeading extends Component {
}
