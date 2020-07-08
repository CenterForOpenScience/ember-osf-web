import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';

import NodeModel from 'ember-osf-web/models/node';
import RegistrationSchemaModel from 'ember-osf-web/models/registration-schema';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException from 'ember-osf-web/utils/capture-exception';

export default class BrandedRegistriesNewSubmissionController extends Controller {
    @service store!: DS.Store;
    @service currentUser!: CurrentUserService;
    @tracked selectedProject?: NodeModel = undefined;
    @tracked selectedSchema?: RegistrationSchemaModel = undefined;
    @tracked schemaOptions?: RegistrationSchemaModel[] = [];
    @tracked projectOptions?: NodeModel[] = [];

    @task({ withTestWaiter: true })
    createNewDraftRegistration = task(function *(this: BrandedRegistriesNewSubmissionController) {
        const newRegistration = this.store.createRecord('draft-registration',
            {
                registrationSchema: this.selectedSchema,
                provider: this.model,
                branchedFrom: this.selectedProject,
            });
        try {
            yield newRegistration.save();
            this.transitionToRoute('drafts.draft', newRegistration.id);
        } catch (e) {
            captureException(e);
        }
    });

    @task({ withTestWaiter: true })
    findAllSchemas = task(function *(this: BrandedRegistriesNewSubmissionController) {
        try {
            const schemas: RegistrationSchemaModel[] = yield this.model.schemas;
            [this.selectedSchema] = schemas.toArray();
            this.schemaOptions = schemas;
        } catch (e) {
            captureException(e);
        }
    });

    @task({ withTestWaiter: true, restartable: true })
    projectSearch = task(function *(this: BrandedRegistriesNewSubmissionController, query: string) {
        yield timeout(500); // debounce
        try {
            const nodes = yield this.currentUser.user!.queryHasMany('nodes',
                {
                    filter: {
                        title: query,
                    },
                });
            this.projectOptions = nodes;
            return nodes;
        } catch (e) {
            captureException(e);
            throw e;
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
