import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import { Answerable } from '../component';
import template from './template';

@tagName('')
@layout(template)
export default class ViewText extends Component {
    answerable!: Answerable;
}
