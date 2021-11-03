import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';
import Store from '@ember-data/store';

import { layout } from 'ember-osf-web/decorators/component';
import Node, { NodeType } from 'ember-osf-web/models/node';
import Registration from 'ember-osf-web/models/registration';
import Analytics from 'ember-osf-web/services/analytics';
import pathJoin from 'ember-osf-web/utils/path-join';
import Toast from 'ember-toastr/services/toast';

import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import RouterService from '@ember/routing/router-service';
import SchemaResponseModel from 'ember-osf-web/models/schema-response';
import Intl from 'ember-intl/services/intl';
import RegistrationModel from 'ember-osf-web/models/registration';
import { taskFor } from 'ember-concurrency-ts';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import template from './template';
import styles from './styles';


const { OSF: { url: baseURL } } = config;

@layout(template, styles)
@tagName('')
export default class NodeCard extends Component {
    @service analytics!: Analytics;
    @service router!: RouterService;
    @service store!: Store;
    @service toast!: Toast;
    @service intl!: Intl;
    // Optional parameters
    node?: Node | Registration;
    delete?: (node: Node) => void;
    showTags = false;
    readOnly = false;

    // Private properties
    searchUrl = pathJoin(baseURL, 'search');
    @tracked
    latestSchemaResponse?: SchemaResponseModel;

    @computed('readOnly', 'node', 'node.{nodeType,userHasWritePermission}')
    get showDropdown() {
        return !this.readOnly && this.node && this.node.nodeType === NodeType.Fork && this.node.userHasWritePermission;
    }

    @task
    @waitFor
    async getLatestRevision(registration: RegistrationModel) {
        if (!registration) {
            const notARegistrationError = this.intl.t('registries.update_dropdown.not_a_registration_error');
            return this.toast.error(notARegistrationError);
        }

        if (registration.reviewsState !== 'accepted' && registration.reviewsState !== 'embargo') {
            if (registration.revisionState !== 'approved') {
                return;
            }
        } else {
            try {
                const revisions = await registration.queryHasMany('schemaResponses');
                if (revisions) {
                    this.latestSchemaResponse = revisions[0];
                }
            } catch (e) {
                const errorMessage = this.intl.t('node_card.schema_response_error');
                captureException(e, {errorMessage});
                this.toast.error(getApiErrorMessage(e), errorMessage);
            }
        }
    }

    didReceiveAttrs() {
        if (this.node?.isRegistration) {
            taskFor(this.getLatestRevision).perform(this.node as Registration);
        }
    }

    @task
    @waitFor
    async createNewSchemaResponse() {
        const newRevision: SchemaResponseModel = this.store.createRecord('schema-response', {
            registration: this.node,
        });
        await newRevision.save();
        this.router.transitionTo('registries.edit-revision', newRevision.id);
    }

    @computed('node.isRegistration')
    get shouldShowUpdateButton(): boolean {
        let showUpdateButton = false;
        if (this.node && this.node.isRegistration) {
            const registration = this.node as Registration;
            if (registration.reviewsState === 'accepted' || registration.reviewsState === 'embargo') {
                showUpdateButton = true;
            } else {
                showUpdateButton = false;
            }
        }
        return showUpdateButton;
    }
}
