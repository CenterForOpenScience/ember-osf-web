import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import template from './template';

export interface DescriptionManager {
    save: () => void;
    cancel: () => void;
    inEditMode: boolean;
    currentDescription: string;
    description: string;
}

@tagName('')
@layout(template)
export default class DescriptionManagerComponent extends Component {
    // required
    node!: Node;

    // private
    @service intl!: Intl;
    @service toast!: Toast;

    requestedEditMode: boolean = false;
    currentDescription!: string;

    @alias('node.userHasWritePermission') userCanEdit!: boolean;
    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;

    @computed('node.description')
    get fieldIsEmpty() {
        return !this.node.description;
    }

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

    @task
    @waitFor
    async save() {
        if (this.node) {
            this.node.set('description', this.currentDescription);
            try {
                await this.node.save();
            } catch (e) {
                const errorMessage = this.intl.t('registries.registration_metadata.edit_description.error');
                captureException(e, { errorMessage });
                this.node.rollbackAttributes();
                this.toast.error(getApiErrorMessage(e), errorMessage);
                throw e;
            }
            this.set('requestedEditMode', false);
            this.toast.success(this.intl.t('registries.registration_metadata.edit_description.success'));
        }
    }

    @action
    startEditing() {
        this.setProperties({
            requestedEditMode: true,
            currentDescription: this.node.description,
        });
    }

    @action
    cancel() {
        this.set('requestedEditMode', false);
    }
}
