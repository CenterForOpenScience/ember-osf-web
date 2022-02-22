import { assert } from '@ember/debug';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import { restartableTask, task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import ModeratorModel from 'ember-osf-web/models/moderator';
import Registration from 'ember-osf-web/models/registration';
import SchemaResponseModel from 'ember-osf-web/models/schema-response';
import { getSchemaBlockGroups, SchemaBlock, SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import template from './template';

@tagName('')
@layout(template)
export default class RegistrationFormViewSchemaBlocks extends Component {
    @service store!: Store;
    @service toast!: Toast;
    @service currentUser!: CurrentUserService;
    @service intl!: Intl;
    // Required parameter
    registration!: Registration;
    revision!: SchemaResponseModel;

    // Optional parameters
    updatedResponseIds?: string[];
    mode?: string;

    // Private properties
    schemaBlocks?: SchemaBlock[];
    schemaBlockGroups?: SchemaBlockGroup[];
    responses?: { [key: string]: string };

    @tracked currentModerator?: ModeratorModel;

    @computed('currentModerator', 'registration.{latestResponse.content,schemaResponses.length}')
    get showMetadata() {
        return this.registration.latestResponse.content && !this.registration.latestResponse.get('isOriginalResponse')
            || (Boolean(this.currentModerator) && this.registration.schemaResponses.length > 1);
    }

    @restartableTask({ on: 'didReceiveAttrs' })
    @waitFor
    async fetchSchemaBlocks() {
        try {
            if (this.revision && this.registration) {
                const registrationSchema = await this.registration.registrationSchema;
                const responses = this.revision.revisionResponses;
                const schemaBlocks: SchemaBlock[] = await registrationSchema.loadAll('schemaBlocks');
                const schemaBlockGroups = getSchemaBlockGroups(schemaBlocks, this.updatedResponseIds);
                this.set('schemaBlocks', schemaBlocks);
                this.set('schemaBlockGroups', schemaBlockGroups);
                this.set('responses', responses);
            }
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    }

    @task
    @waitFor
    async loadCurrentModerator() {
        try {
            this.currentModerator = await this.store.findRecord('moderator', this.currentUser.currentUserId!,
                {
                    adapterOptions: {
                        providerId: this.registration.provider.get('id'),
                    },
                });
        } catch (e) {
            captureException(e);
            this.toast.error(this.intl.t('registries.overviewHeader.needModeratorPermission'));
        }
    }

    didReceiveAttrs() {
        assert('OverviewFormRenderer needs a registration', Boolean(this.registration));
        if (this.mode === 'moderator') {
            taskFor(this.loadCurrentModerator).perform();
        }
    }
}
