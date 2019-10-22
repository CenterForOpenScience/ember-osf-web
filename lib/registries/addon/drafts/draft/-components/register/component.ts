import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import DraftRegistration from 'ember-osf-web/models/draft-registration';
import Registration from 'ember-osf-web/models/registration';
import { DraftRegistrationManager } from 'osf-components/components/registries/draft-registration-manager/component';

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
    rootNode?: Node;
    registration!: Registration;

    showPartialRegDialog = false;
    showFinalizeRegDialog = false;

    didReceiveAttrs() {
        assert('@draftManager is required!', Boolean(this.draftManager));
        assert('@draftRegistration is required!', Boolean(this.draftRegistration));

        if (!this.registration) {
            const registration = this.store.createRecord('registration', {
                draftRegistration: this.draftRegistration,
            });

            this.setProperties({ registration });
        }
    }

    @computed('showFinalizeRegDialog', 'registration')
    get shouldShowFinalizeRegDialog() {
        return this.showFinalizeRegDialog && Boolean(this.registration);
    }

    @computed('showPartialRegDialog',
        'draftManager.registrationResponsesIsValid',
        'rootNode')
    get shouldShowPartialRegDialog() {
        return this.showPartialRegDialog &&
            this.draftManager.registrationResponsesIsValid && Boolean(this.rootNode);
    }

    @action
    onContinue(nodes: Node[]) {
        const includedNodeIds = nodes.mapBy('id');
        this.registration.setProperties({ includedNodeIds });

        this.toggleProperty('showPartialRegDialog');
        this.toggleProperty('showFinalizeRegDialog');
    }

    @action
    onOpen() {
        this.set('showPartialRegDialog', true);
    }

    @action
    onClose() {
        this.set('showPartialRegDialog', false);
        this.set('showFinalizeRegDialog', false);
    }
}
