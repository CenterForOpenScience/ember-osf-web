import Component from '@ember/component';
import { computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import { NodeCategory } from 'ember-osf-web/models/node';
import { CategoryManager } from 'osf-components/components/editable-field/category-manager/component';

import template from './template';

@layout(template)
export default class NodeCategoryPicker extends Component {
    manager!: CategoryManager;

    @computed('manager.selectedCategory')
    get categories() {
        return Object.values(NodeCategory)
            .filter(category => category !== this.manager.selectedCategory);
    }
}
