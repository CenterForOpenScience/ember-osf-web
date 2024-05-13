import Component from '@glimmer/component';
import { ValidationObject } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';

/**
 * The Create Node Args
 */
interface CreateNodeArgs {
    projectSelected: (_: Node) => {};
    cancelProject: () => {};
}

interface NewProjectForm {
    title: string;
}

const NewProjectFormValidation: ValidationObject<NewProjectForm> = {
    title: validatePresence({
        presence: true,
        ignoreBlank: true,
        type: 'empty',
    }),
};

/**
 * The Supplements Component
 */
export default class PreprintCreateNodeWidget extends Component<CreateNodeArgs>{
    @service store!: Store;
    projectTitleFormChangeset = buildChangeset({title: ''}, NewProjectFormValidation);
    @tracked isButtonDisabled = true;

    @task
    @waitFor
    public async createNewProject(): Promise<void> {
        const node = this.store.createRecord('node', {
            title: this.projectTitleFormChangeset.get('title'),
        });
        await node.save();
        this.args.projectSelected(node);
    }

    @action
    public validate(): void {
        this.projectTitleFormChangeset.validate();
        if (this.projectTitleFormChangeset.isInvalid) {
            this.isButtonDisabled = true;
            return;
        }
        this.isButtonDisabled = false;
        this.projectTitleFormChangeset.execute();
    }
}

