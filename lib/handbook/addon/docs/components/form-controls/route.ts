import { computed } from '@ember-decorators/object';
import Route from '@ember/routing/route';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { task } from 'ember-concurrency';
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';

import FormController from './controller';

export default class FormControls extends Route.extend(ConfirmationMixin, {
    modelTask: task(function *(this: FormControls) {
        return yield this.store.findRecord('node', 'extng');
    }),
}) {
    model() {
        return {
            taskInstance: this.modelTask.perform(),
        };
    }

    setupController(controller: FormController) {
        const model = {
            title: '',
            description: '',
        };
        const changeset = new Changeset(model, lookupValidator(controller.validation), controller.validation);
        controller.set('changeset', changeset);
    }

    @computed('controller.isDirty')
    get isPageDirty() {
        const controller = this.controller as FormController;
        return () => controller.get('isDirty');
    }
}
