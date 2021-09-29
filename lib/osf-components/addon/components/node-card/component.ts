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

    @computed('readOnly', 'node', 'node.{nodeType,userHasWritePermission}')
    get showDropdown() {
        return !this.readOnly && this.node && this.node.nodeType === NodeType.Fork && this.node.userHasWritePermission;
    }

    @task
    @waitFor
    async getLatestRevision(registration: RegistrationModel) {
        const schemaResponseDates: Date[] = [];
        if (!registration){
            const notReistrationError = this.intl.t('registries.update_dropdown.not_a_registration_error');
            return this.toast.error(notReistrationError);
        }
        try {
            const revisionList : SchemaResponseModel[] = await registration.queryHasMany('schemaResponses');
            revisionList.forEach(revision => {
                const date: Date = revision.dateModified;
                schemaResponseDates.push(date);
            });
            const latestDate = schemaResponseDates.sort((a: any, b: any) =>
                new Date(b).valueOf() - new Date(a).valueOf())[0];

            const latestSchemaResponse = revisionList.filter(revision => revision.dateModified === latestDate);
            registration.set('latestSchemaResponse', latestSchemaResponse);

        } catch (e) {
            const errorMessage = this.intl.t('node.schema_response_error');
            captureException(e, {errorMessage});
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }

    didReceiveAttrs() {
        if (this.node?.isRegistration) {
            taskFor(this.getLatestRevision).perform(this.node as Registration);
        }
    }

    // TODO add to button for Update when clicked, add route
    @task
    @waitFor
    async createNewSchemaResponse() {
        const newRevision: SchemaResponseModel = this.store.createRecord('schema-response', {
            registration: this.node,
        });
        await newRevision.save();
        this.router.transitionTo('registries.edit-revision', newRevision.id);
    }
}
