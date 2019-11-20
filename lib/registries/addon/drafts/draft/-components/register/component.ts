import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { run } from '@ember/runloop';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import DraftRegistration from 'ember-osf-web/models/draft-registration';
import NodeModel from 'ember-osf-web/models/node';
import Registration from 'ember-osf-web/models/registration';
import { DraftRegistrationManager } from 'osf-components/components/registries/draft-registration-manager/component';

@tagName('')
export default class Register extends Component.extend({
    getBranchFromNode: task(function *(this: Register) {
        if (this.draftRegistration) {
            const rootNode = yield this.draftRegistration.branchedFrom;
            this.setProperties({ rootNode });
        }
    }).on('didReceiveAttrs').restartable(),
}) {
    @service store!: DS.Store;

    // Required
    draftManager!: DraftRegistrationManager;
    draftRegistration!: DraftRegistration;

    // Private
    registration!: Registration;
    rootNode!: NodeModel;
    onSubmitRedirect?: (registrationId: string) => void;
    @alias('draftManager.hasInvalidResponses') isInvalid?: boolean;

    partialRegDialogIsOpen = false;
    finalizeRegDialogIsOpen = false;

    didReceiveAttrs() {
        assert('@draftManager is required!', Boolean(this.draftManager));
        assert('@draftRegistration is required!', Boolean(this.draftRegistration));
    }

    @action
    onRegister() {
        if (!this.registration) {
            const registration = this.store.createRecord('registration', {
                draftRegistrationId: this.draftRegistration.id,
                registeredFrom: this.draftRegistration.branchedFrom,
            });

            this.setProperties({ registration });
        }
        if (this.rootNode && this.rootNode.relatedCounts.children > 0) {
            this.showPartialRegDialog();
        } else {
            this.showFinalizeRegDialog();
        }
    }

    @action
    onSubmitRegistration(registrationId: string) {
        this.closeAllDialogs();

        if (this.onSubmitRedirect) {
            this.onSubmitRedirect(registrationId);
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
        if (this.rootNode.relatedCounts.children > 0) {
            run.next(this, () => {
                this.showPartialRegDialog();
            });
        }
    }
}
