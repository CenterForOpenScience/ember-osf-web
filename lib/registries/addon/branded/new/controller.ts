import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';

import NodeModel from 'ember-osf-web/models/node';
import RegistrationSchemaModel from 'ember-osf-web/models/registration-schema';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import Toast from 'ember-toastr/services/toast';

export default class BrandedRegistriesNewSubmissionController extends Controller {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUserService;
    @service store!: DS.Store;
    @service toast!: Toast;

    @tracked selectedProject?: NodeModel;
    @tracked selectedSchema?: RegistrationSchemaModel;
    @tracked schemaOptions: RegistrationSchemaModel[] = [];
    @tracked projectOptions: NodeModel[] = [];

    get disableCreateDraft(): boolean {
        return !(this.selectedSchema && this.selectedProject);
    }

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
            this.toast.error(getApiErrorMessage(e));
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
            this.toast.error(getApiErrorMessage(e));
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
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    });

    @action
    updateSelectedSchema(schema: RegistrationSchemaModel) {
        this.analytics.click('button', 'Update selected schema');
        this.selectedSchema = schema;
    }

    @action
    updateSelectedProject(project: NodeModel) {
        this.analytics.click('button', 'Update selected project');
        this.selectedProject = project;
    }
}
