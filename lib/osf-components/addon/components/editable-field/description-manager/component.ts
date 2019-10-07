import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';

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
export default class DescriptionManagerComponent extends Component.extend({
    save: task(function *(this: DescriptionManagerComponent) {
        if (this.node) {
            this.node.set('description', this.currentDescription);
            try {
                yield this.node.save();
            } catch (e) {
                this.node.rollbackAttributes();
                this.toast.error(this.i18n.t('registries.registration_metadata.edit_description.error'));
                throw e;
            }
            this.set('requestedEditMode', false);
            this.toast.success(this.i18n.t('registries.registration_metadata.edit_description.success'));
        }
    }),
}) {
    // required
    node!: Node;

    // private
    @service i18n!: I18N;
    @service toast!: Toast;

    requestedEditMode: boolean = false;
    currentDescription!: string;

    @alias('node.userHasAdminPermission') userCanEdit!: boolean;
    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;

    @computed('node.description')
    get fieldIsEmpty() {
        return !this.node.description;
    }

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
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
