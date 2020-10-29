import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { restartableTask, task } from 'ember-concurrency-decorators';
import DS from 'ember-data';

import DraftRegistrationModel from 'ember-osf-web/models/draft-registration';
import NodeModel from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
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
    @tracked isBasedOnProject: boolean = false;

    get disableCreateDraft(): boolean {
        return this.isBasedOnProject ? !(this.selectedSchema && this.selectedProject) : !this.selectedSchema;
    }

    @task({ withTestWaiter: true })
    async createNewDraftRegistration() {
        let newRegistration: DraftRegistrationModel;
        if (this.isBasedOnProject) {
            newRegistration = this.store.createRecord('draft-registration', {
                registrationSchema: this.selectedSchema,
                provider: this.model,
                branchedFrom: this.selectedProject,
            });
        } else {
            newRegistration = this.store.createRecord('draft-registration', {
                registrationSchema: this.selectedSchema,
                provider: this.model,
            });
        }
        try {
            await newRegistration.save();
            this.transitionToRoute('drafts.draft', newRegistration.id);
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    }

    @task({ withTestWaiter: true })
    async findAllSchemas() {
        try {
            const schemas = await this.model.schemas;
            [this.selectedSchema] = schemas.toArray();
            this.schemaOptions = schemas;
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    }

    @restartableTask({ withTestWaiter: true })
    async projectSearch(query: string) {
        await timeout(500); // debounce
        try {
            const nodes = await this.currentUser.user!.queryHasMany('nodes',
                {
                    filter: {
                        title: query,
                        current_user_permissions: Permission.Admin,
                    },
                });
            this.projectOptions = nodes;
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    }

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
