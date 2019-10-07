import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Node, { NodeCategory } from 'ember-osf-web/models/node';
import template from './template';

export interface CategoryManager {
    save: () => void;
    selectedCategory: NodeCategory;
    category: NodeCategory;
    inEditMode: boolean;
}

@tagName('')
@layout(template)
export default class CategoryManagerComponent extends Component.extend({
    save: task(function *(this: CategoryManagerComponent) {
        this.node.set('category', this.selectedCategory);
        try {
            yield this.node.save();
        } catch (e) {
            this.node.rollbackAttributes();
            this.toast.error(this.i18n.t('registries.registration_metadata.edit_category.error'));
            throw e;
        }
        this.set('inEditMode', false);
        this.toast.success(this.i18n.t('registries.registration_metadata.edit_category.success'));
    }),
}) {
    // required
    node!: Node;

    // private
    @service i18n!: I18N;
    @service toast!: Toast;

    inEditMode: boolean = false;
    fieldIsEmpty = false;
    selectedCategory!: NodeCategory;

    @alias('node.userHasAdminPermission') userCanEdit!: boolean;
    @alias('node.category') category!: NodeCategory;

    didReceiveAttrs() {
        if (this.node) {
            this.setProperties({ selectedCategory: this.node.category });
        }
    }

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
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
