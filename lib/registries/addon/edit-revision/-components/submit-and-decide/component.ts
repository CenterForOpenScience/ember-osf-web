import Store from '@ember-data/store';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import { SchemaResponseActionTrigger } from 'ember-osf-web/models/schema-response-action';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import Toast from 'ember-toastr/services/toast';

import RevisionManager from 'registries/edit-revision/revision-manager';

@tagName('')
export default class SubmitAndDecide extends Component {
    @service store!: Store;
    @service toast!: Toast;
    @service intl!: Intl;

    // Required
    revisionManager!: RevisionManager;

    @tracked continueEditModalOpen = false;

    @computed('revisionManager.{isPendingAdminApproval,currentUserIsAdmin,isPendingModeration}')
    get pendingStatusString(): string {
        if (this.revisionManager.isPendingAdminApproval) {
            return 'registries.edit_revision.review.pending_admin_notice';
        }
        if (this.revisionManager.isPendingModeration) {
            return 'registries.edit_revision.review.pending_moderation_notice';
        }
        return 'registries.edit_revision.review.decision_recorded_notice';
    }


    @action
    openContinueEditModal() {
        this.set('continueEditModalOpen', true);
    }

    @action
    closeContinueEditModal() {
        this.set('continueEditModalOpen', false);
    }

    @task
    @waitFor
    async submitAction(actionTrigger: SchemaResponseActionTrigger, comment: string) {
        try {
            const schemaResponseAction = this.store.createRecord('schema-response-action', {
                actionTrigger,
                comment: comment ? comment : undefined,
                target: this.revisionManager.revision,
            });
            await schemaResponseAction.save();
            await this.revisionManager.revision.reload();
            this.toast.success(this.intl.t('registries.edit_revision.review.action_submit_success'));
        } catch (e) {
            const errorMessage = this.intl.t('registries.edit_revision.review.action_submit_failed');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }

    didReceiveAttrs() {
        assert('@revisionManager is required!', Boolean(this.revisionManager));
    }
}
