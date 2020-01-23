import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { timeout } from 'ember-concurrency';
import Toast from 'ember-toastr/services/toast';

export default class DeleteButtonController extends Controller {
    @service toast!: Toast;

    // BEGIN-SNIPPET delete-button.delete-action.ts
    @action
    async delete(text: string) {
        await timeout(1000);
        this.toast.success(text, 'Deleted!');
    }
    // END-SNIPPET
}
