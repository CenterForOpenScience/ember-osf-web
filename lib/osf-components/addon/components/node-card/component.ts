import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'ember-osf-web/config/environment';
import Store from '@ember-data/store';

import { layout } from 'ember-osf-web/decorators/component';
import Node, { NodeType } from 'ember-osf-web/models/node';
import Registration, {
    RegistrationReviewStates,
} from 'ember-osf-web/models/registration';
import Analytics from 'ember-osf-web/services/analytics';
import pathJoin from 'ember-osf-web/utils/path-join';
import Toast from 'ember-toastr/services/toast';

import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import RouterService from '@ember/routing/router-service';
import SchemaResponseModel, {
    RevisionReviewStates,
} from 'ember-osf-web/models/schema-response';
import Intl from 'ember-intl/services/intl';
import RegistrationModel from 'ember-osf-web/models/registration';
import { taskFor } from 'ember-concurrency-ts';
import captureException, {
    getApiErrorMessage,
} from 'ember-osf-web/utils/capture-exception';
import CustomFileMetadataRecordModel from 'ember-osf-web/models/custom-file-metadata-record';
import { assert } from '@ember/debug';
import Media from 'ember-responsive';
import template from './template';
import styles from './styles';

const {
    OSF: { url: baseURL },
} = config;

@layout(template, styles)
@tagName('')
export default class NodeCard extends Component {
    @service analytics!: Analytics;
    @service router!: RouterService;
    @service store!: Store;
    @service toast!: Toast;
    @service intl!: Intl;
    @service media!: Media;

    // Optional parameters
    node?: Node | Registration;
    delete?: (node: Node) => void;
    showTags = false;
    readOnly = false;

    // Private properties
    searchUrl = pathJoin(baseURL, 'search');
    @tracked resourceType?: string;
    @tracked latestSchemaResponse!: SchemaResponseModel;
    @tracked showNewUpdateModal = false;
    @tracked isOpenResourceType = false;

    @computed('readOnly', 'node', 'node.{nodeType,userHasWritePermission}')
    get showDropdown() {
        return (
            !this.readOnly &&
            this.node &&
            this.node.nodeType === NodeType.Fork &&
            this.node.userHasWritePermission
        );
    }

    @task
    @waitFor
    async getLatestRevision(registration: RegistrationModel) {
        assert('getLatestRevision requires a registration', registration);
        if (
            registration.reviewsState === RegistrationReviewStates.Accepted ||
            registration.reviewsState === RegistrationReviewStates.Embargo
        ) {
            try {
                const revisions = await registration.queryHasMany(
                    'schemaResponses',
                );
                if (revisions) {
                    this.latestSchemaResponse = revisions[0];
                }
            } catch (e) {
                const errorMessage = this.intl.t(
                    'node_card.schema_response_error',
                );
                captureException(e, { errorMessage });
                this.toast.error(getApiErrorMessage(e), errorMessage);
            }
        }
    }

    @task
    @waitFor
    async getGuidMetadata() {
        const guidRecord = await this.store.findRecord('guid', this.node?.id, {
            include: 'custom_metadata',
            resolve: false,
        });

        const metadataRecord =
            (await guidRecord.customMetadata) as CustomFileMetadataRecordModel;
        this.resourceType =
            metadataRecord?.resourceTypeGeneral ||
            this.intl.t('node_card.resource-type.none-selected');
    }

    @action
    async toggleResourceType() {
        this.isOpenResourceType = !this.isOpenResourceType;
        if (this.isOpenResourceType) {
            taskFor(this.getGuidMetadata).perform();
        }
    }

    didReceiveAttrs() {
        if (this.node?.isRegistration) {
            taskFor(this.getLatestRevision).perform(this.node as Registration);
        }
    }

    get isMobile() {
        return this.media.isMobile;
    }

    get shouldAllowUpdate() {
        if (this.node instanceof RegistrationModel) {
            return (
                this.node.reviewsState === RegistrationReviewStates.Accepted ||
                this.node.reviewsState === RegistrationReviewStates.Embargo
            );
        }
        return false;
    }

    get displayIcon(): boolean {
        return !(this.node?.isRegistration || this.node?.isProject);
    }

    get shouldShowViewChangesButton() {
        if (this.node instanceof RegistrationModel) {
            return (
                this.shouldAllowUpdate &&
                (this.node.revisionState ===
                    RevisionReviewStates.RevisionInProgress ||
                    this.node.revisionState ===
                        RevisionReviewStates.RevisionPendingModeration ||
                    this.node.revisionState === RevisionReviewStates.Unapproved)
            );
        }
        return false;
    }

    get shouldShowUpdateButton() {
        if (
            this.node instanceof RegistrationModel &&
            this.node.userHasAdminPermission
        ) {
            return (
                this.node.revisionState === RevisionReviewStates.Approved &&
                this.shouldAllowUpdate
            );
        }
        return false;
    }
}
