import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import layout from './template';

@tagName('')
export default class XNoop extends Component {
    layout = layout;
}
