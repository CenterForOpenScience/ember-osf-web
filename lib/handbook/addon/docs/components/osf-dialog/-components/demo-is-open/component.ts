import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

@tagName('')
export default class DemoIsOpen extends Component {
    isOpen = false;
}
