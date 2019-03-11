import { computed } from '@ember-decorators/object';
import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';

import ValidatedModelFormController from './controller';

export default class ValidatedModelFormRoute extends Route.extend(ConfirmationMixin, {
    modelTask: task(function *(this: ValidatedModelFormRoute) {
        return yield this.store.findRecord('node', 'extng');
    }),
}) {
    model() {
        return {
            taskInstance: this.modelTask.perform(),
        };
    }

    // BEGIN-SNIPPET validated-model-form.route.ts
    // This tells ember-onbeforeupload's ConfirmationMixin whether or not to stop transitions
    @computed('controller.isDirty')
    get isPageDirty() {
        const controller = this.controller as ValidatedModelFormController;
        return () => controller.get('isDirty');
    }
    // END-SNIPPET
}
