import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Toast from 'ember-toastr/services/toast';

export default class extends Component {
    @service toast!: Toast;

    // BEGIN-SNIPPET link.demo-onclick.ts
    @action
    doTheThing() {
        this.toast.info('You did the thing!');
    }
    // END-SNIPPET link.demo-onclick.ts
}
