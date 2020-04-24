import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import DS from 'ember-data';
import Toast from 'ember-toastr/services/toast';

import Node from 'ember-osf-web/models/node';

export default class ValidatedModelFormController extends Controller {
    @service store!: DS.Store;

    @service toast!: Toast;

    @reads('model.taskInstance.value')
    existingNode?: Node;

    createDirt = false;

    editDirt = false;

    // BEGIN-SNIPPET validated-model-form.controller.ts
    @action
    async onSave() {
        if (this.existingNode !== undefined) {
            this.toast.success('Saved!');
        } else {
            this.toast.error('Nothing to save');
        }
    }

    @action
    onWillDestroy() {
        if (this.get('isDirty')) {
            // Do something cool here
        }
    }

    // Since there are two forms on the page, we need to report on both
    @action
    changeDirtEditForm(dirt: boolean) {
        this.set('editDirt', dirt);
    }

    @action
    changeDirtCreateForm(dirt: boolean) {
        this.set('createDirt', dirt);
    }

    @computed('createDirt', 'editDirt')
    get isDirty() {
        return this.createDirt || this.editDirt;
    }
    // END-SNIPPET
}
