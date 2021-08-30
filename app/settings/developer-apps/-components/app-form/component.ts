import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { BufferedChangeset } from 'ember-changeset/types';
import { task, TaskInstance } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import DeveloperApp, { developerAppValidations } from 'ember-osf-web/models/developer-app';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

@tagName('')
export default class DeveloperAppForm extends Component {
    @service intl!: Intl;
    @service router!: RouterService;
    @service toast!: Toast;

    // Required arguments
    developerApp?: DeveloperApp;
    appTaskInstance?: TaskInstance<DeveloperApp>;
    createMode = false;

    changeset!: BufferedChangeset;
    appInstance?: DeveloperApp | null;

    @task
    @waitFor
    async createChangeset() {
        this.appInstance = this.developerApp;
        if (this.appTaskInstance) {
            await this.appTaskInstance;
            this.appInstance = this.appTaskInstance.value;
        }

        if (this.appInstance) {
            this.changeset = buildChangeset(this.appInstance, developerAppValidations, { skipValidate: true });
        }
    }

    @task
    @waitFor
    async createNewApp() {
        this.changeset.validate();
        try {
            if (this.appInstance && this.changeset.isValid) {
                await this.changeset.save({});
                this.toast.success(this.intl.t('settings.developer-apps.created'));
                this.router.transitionTo('settings.developer-apps.edit', this.appInstance.get('id'));
            }
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    }

    @task
    @waitFor
    async updateApp() {
        this.changeset.validate();
        try {
            if (this.changeset.isValid) {
                await this.changeset.save({});
                this.toast.success(this.intl.t('settings.developer-apps.saved'));
                this.router.transitionTo('settings.developer-apps');
            }
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    }

    @action
    async deleteApp() {
        // Analytics and errors handled by delete-button
        if (this.developerApp) {
            await this.developerApp.destroyRecord();
            this.toast.success(this.intl.t('settings.developer-apps.deleted'));
        }

        this.router.transitionTo('settings.developer-apps');
    }

    init() {
        super.init();
        assert(
            'AppForm requires either @developerApp xor @taskInstance',
            Boolean(this.developerApp) !== Boolean(this.appTaskInstance),
        );
        taskFor(this.createChangeset).perform();
    }
}
