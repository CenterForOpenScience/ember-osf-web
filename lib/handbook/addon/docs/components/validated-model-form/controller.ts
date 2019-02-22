import { action } from '@ember-decorators/object';
import { reads } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import DS from 'ember-data';
import Toast from 'ember-toastr/services/toast';

import Node from 'ember-osf-web/models/node';

export default class ValidatedModelFormController extends Controller {
    @service store!: DS.Store;
    @service toast!: Toast;

    @reads('model.taskInstance.value')
    existingNode?: Node;

    @action
    async onSave() {
        if (this.existingNode !== undefined) {
            this.toast.success('Saved!');
        } else {
            this.toast.error('Nothing to save');
        }
    }
    // BEGIN-SNIPPET validated-model-form.on-will-destroy.ts
    @action
    onWillDestroy() {
        this.toast.success('The data you entered is gone');
    }
    // END-SNIPPET
}
