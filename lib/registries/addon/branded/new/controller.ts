import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';

import NodeModel from 'ember-osf-web/models/node';
import RegistrationSchemaModel from 'ember-osf-web/models/registration-schema';
import captureException from 'ember-osf-web/utils/capture-exception';

export default class BrandedRegistriesNewSubmissionController extends Controller {
    @tracked selectedProject?: NodeModel = undefined;
    @tracked selectedSchema?: RegistrationSchemaModel = undefined;

    @task({ withTestWaiter: true })
    createNewDraftRegistration = task(function *(this: BrandedRegistriesNewSubmissionController) {
        const newRegistration = this.store.createRecord('draft-registration',
            {
                schema: this.selectedSchema,
                provider: this.model,
                branchedFrom: this.selectedProject,
            });
        try {
            yield newRegistration.save();
            this.transitionToRoute('registries.drafts.draft', newRegistration.id);
        } catch (e) {
            captureException(e);
        }
    });

    @action
    updateSelectedSchema(schema: RegistrationSchemaModel) {
        this.selectedSchema = schema;
    }

    @action
    updateSelectedProject(project: NodeModel) {
        this.selectedProject = project;
    }
}
