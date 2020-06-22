import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';

import DraftRegistration from 'ember-osf-web/models/draft-registration';
import NodeModel from 'ember-osf-web/models/node';
import Registration from 'ember-osf-web/models/registration';
import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';

@tagName('')
export default class Register extends Component {
    @service store!: DS.Store;

    // Required
    draftManager!: DraftRegistrationManager;

    // Private
    registration!: Registration;
    onSubmitRedirect?: (registrationId: string) => void;
    @alias('draftManager.hasInvalidResponses') isInvalid?: boolean;
    @alias('draftManager.draftRegistration') draftRegistration!: DraftRegistration;
    @alias('draftManager.node') node?: NodeModel;

    partialRegDialogIsOpen = false;
    finalizeRegDialogIsOpen = false;

    @task({ withTestWaiter: true })
    onClickRegister = task(function *(this: Register) {
        if (!this.registration) {
            const registration = this.store.createRecord('registration', {
                draftRegistrationId: this.draftRegistration.id,
                registeredFrom: this.draftRegistration.branchedFrom,
            });

            this.setProperties({ registration });
        }
        if (this.node) {
            yield this.node.loadRelatedCount('children');
        }
        if (this.node && this.node.relatedCounts.children > 0) {
            this.showPartialRegDialog();
        } else {
            this.showFinalizeRegDialog();
        }
    });

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
