import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';

import {
    HierarchicalListItemManager,
} from 'osf-components/components/registries/hierarchical-list/item-manager/component';

import { HierarchicalListManager } from 'osf-components/components/registries/hierarchical-list';
import template from './template';

@layout(template)
export default class HierarchicalListItem extends Component {
    manager!: HierarchicalListItemManager;
    listManager!: HierarchicalListManager;
}
