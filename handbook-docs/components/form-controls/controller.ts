import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { BufferedChangeset } from 'ember-changeset/types';
import Toast from 'ember-toastr/services/toast';

import Node from 'ember-osf-web/models/node';

import { nodeValidation } from './validation';

export default class FormController extends Controller {
    @service toast!: Toast;

    validation = nodeValidation;
    node = Node;
    changeset!: BufferedChangeset;

    @action
    submit() {
        this.changeset.validate();
        if (this.changeset.get('isValid')) {
            this.changeset.save({});
            this.toast.success('Saved!');
        }
    }
}
