import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { tracked } from '@glimmer/tracking';
import DraftRegistration from 'ember-osf-web/models/draft-registration';
import NodeModel from 'ember-osf-web/models/node';
import Registration from 'ember-osf-web/models/registration';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';

@tagName('')
export default class Register extends Component {
    @service store!: DS.Store;
    @service toast!: Toast;
    @service intl!: Intl;

    // Required
    draftManager!: DraftRegistrationManager;

    // Private
    onSubmitRedirect?: (registrationId: string) => void;
    @alias('draftManager.hasInvalidResponses') isInvalid?: boolean;
    @alias('draftManager.draftRegistration') draftRegistration!: DraftRegistration;
    @alias('draftManager.hasProject') hasProject!: boolean;
    @alias('draftManager.node') node?: NodeModel;
    @alias('draftManager.currentUserIsAdmin') currentUserIsAdmin!: boolean;

    @tracked registration!: Registration;
    @tracked partialRegDialogIsOpen = false;
    @tracked finalizeRegDialogIsOpen = false;

    @task
    @waitFor
    async onClickRegister() {
        if (!this.registration) {
            this.registration = this.store.createRecord('registration', {
                draftRegistrationId: this.draftRegistration.id,
                provider: this.draftRegistration.provider,
                ...(this.hasProject ? { registeredFrom: this.draftRegistration.branchedFrom } : {}),
            });
        }

        if (this.hasProject && this.node) {
            try {
                await this.node.loadRelatedCount('children');
            } catch (e) {
                const errorMessage = this.intl.t('registries.drafts.draft.unable_to_fetch_children_count');
                captureException(e, { errorMessage });
                this.toast.error(getApiErrorMessage(e), errorMessage);
                throw e;
            }
            if (this.node.relatedCounts.children > 0) {
                this.showPartialRegDialog();
            } else {
                this.showFinalizeRegDialog();
            }
        } else {
            this.showFinalizeRegDialog();
        }
    }

    didReceiveAttrs() {
        assert('@draftManager is required!', Boolean(this.draftManager));
    }

    @action
    onSubmitRegistration(registrationId: string) {
        this.closeAllDialogs();

        if (this.onSubmitRedirect) {
            this.onSubmitRedirect(registrationId);
            this.draftRegistration.unloadRecord();
        }
    }

    @action
    showFinalizeRegDialog() {
        this.set('finalizeRegDialogIsOpen', true);
    }

    @action
    showPartialRegDialog() {
        this.set('partialRegDialogIsOpen', true);
    }

    @action
    closeFinalizeRegDialog() {
        this.set('finalizeRegDialogIsOpen', false);
    }

    @action
    closePartialRegDialog() {
        this.set('partialRegDialogIsOpen', false);
    }

    @action
    closeAllDialogs() {
        this.set('partialRegDialogIsOpen', false);
        this.set('finalizeRegDialogIsOpen', false);
    }

    @action
    onContinue(nodes: Node[]) {
        const includedNodeIds = nodes.mapBy('id');
        this.registration.setProperties({ includedNodeIds });

        this.closePartialRegDialog();
        run.next(this, () => {
            this.showFinalizeRegDialog();
        });
    }

    @action
    onBack() {
        this.closeFinalizeRegDialog();
        if (this.node && this.node.relatedCounts.children > 0) {
            run.next(this, () => {
                this.showPartialRegDialog();
            });
        }
    }
}
