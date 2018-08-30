import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
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
