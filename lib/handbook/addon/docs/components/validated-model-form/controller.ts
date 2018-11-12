import { action } from '@ember-decorators/object';
import { readOnly } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import DS from 'ember-data';
import Toast from 'ember-toastr/services/toast';

import Node from 'ember-osf-web/models/node';

export default class ValidatedModelFormController extends Controller {
    @service store!: DS.Store;
    @service toast!: Toast;

    @readOnly('model.taskInstance.value')
    existingNode?: Node;

    @action
    async onSave() {
        if (this.existingNode !== undefined) {
            this.existingNode.save();
            this.toast.success('Saved!');
        } else {
            this.toast.error('Nothing to save');
        }
    }

    @action
    onWillDestroy() {
        if (this.existingNode !== undefined) {
            this.existingNode.rollbackAttributes();
        }
    }
}
