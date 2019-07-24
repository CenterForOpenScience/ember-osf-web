import { computed } from '@ember-decorators/object';
import { reads } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
// import Changeset from 'ember-changeset';
// import lookupValidator from 'ember-changeset-validations';
import { ChangesetDef } from 'ember-changeset/types';
import DS from 'ember-data';
import Toast from 'ember-toastr/services/toast';

import Node from 'ember-osf-web/models/node';

import { nodeValidation } from './validation';

export default class FormController extends Controller {
    @service store!: DS.Store;
    @service toast!: Toast;

    @reads('model.taskInstance.value')
    existingNode?: Node;
    createDirt = false;
    editDirt = false;
    validation = nodeValidation;
    node = Node;
    changeset!: ChangesetDef;

    @computed('createDirt', 'editDirt')
    get isDirty() {
        return this.createDirt || this.editDirt;
    }

    @action
    submit() {
        this.changeset.save({});
        this.toast.success('Saved!');
    }
}
