import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
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
