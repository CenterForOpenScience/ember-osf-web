import Component from '@ember/component';
import { action } from '@ember/object';

export default class DemoOsfButton extends Component {
    buttonType = 'default';

    // BEGIN-SNIPPET osf-button.action
    @action
    youPressedTheButton() {
        if (this.buttonType === 'default') {
            this.set('buttonType', 'primary');
        } else if (this.buttonType === 'primary') {
            this.set('buttonType', 'warning');
        } else if (this.buttonType === 'warning') {
            this.set('buttonType', 'danger');
        } else {
            this.set('buttonType', 'default');
        }
    }
    // END-SNIPPET
}
