import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Node, { NodeCategory } from 'ember-osf-web/models/node';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import template from './template';

export interface CategoryManager {
    save: () => void;
    selectedCategory: NodeCategory;
    category: NodeCategory;
    inEditMode: boolean;
}

@tagName('')
@layout(template)
export default class CategoryManagerComponent extends Component {
    // required
    node!: Node;

    // private
    @service intl!: Intl;
    @service toast!: Toast;

    inEditMode: boolean = false;
    fieldIsEmpty = false;
    selectedCategory!: NodeCategory;

    @alias('node.userHasWritePermission') userCanEdit!: boolean;
    @alias('node.category') category!: NodeCategory;

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

    @task
    async save() {
        this.node.set('category', this.selectedCategory);
        try {
            await this.node.save();
        } catch (e) {
            this.node.rollbackAttributes();
            const errorMessage = this.intl.t('registries.registration_metadata.edit_category.error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }
        this.set('inEditMode', false);
        this.toast.success(this.intl.t('registries.registration_metadata.edit_category.success'));
    }

    didReceiveAttrs() {
        if (this.node) {
            this.setProperties({ selectedCategory: this.node.category });
        }
    }

    @action
    startEditing() {
        this.set('inEditMode', true);
    }

    @action
    onSelect(category: NodeCategory) {
        this.set('selectedCategory', category);
    }

    @action
    cancel() {
        this.set('selectedCategory', this.node.category);
        this.set('inEditMode', false);
    }
}
