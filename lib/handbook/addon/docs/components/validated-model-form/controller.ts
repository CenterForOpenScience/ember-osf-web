import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { timeout } from 'ember-concurrency';
import Toast from 'ember-toastr/services/toast';

export default class ValidatedModelFormController extends Controller {
    @service toast!: Toast;

    @action
    async onSave() {
        await timeout(1000); // Long enough to demo loading state
        this.toast.success('Saved!');
    }
}
