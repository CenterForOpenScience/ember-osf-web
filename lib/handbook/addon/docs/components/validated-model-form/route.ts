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

    // BEGIN-SNIPPET validated-model-form.is-page-dirty.ts
    // This tells ember-onbeforeupload's ConfirmationMixin whether or not to stop transitions
    @computed('controller.{existingNode,existingNode.hasDirtyAttributes}')
    get isPageDirty() {
        const controller = this.controller as ValidatedModelFormController;
        const existingNode = controller.existingNode !== undefined ? controller.existingNode : null;
        const value = (existingNode !== null) ? existingNode.hasDirtyAttributes : false;
        return () => value;
    }
    // END-SNIPPET
}
