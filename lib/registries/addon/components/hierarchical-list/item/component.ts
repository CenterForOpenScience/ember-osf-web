import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';

import { HierarchicalListItemManager } from 'registries/components/hierarchical-list/item-manager/component';
import { PartialRegistrationModalManager } from 'registries/components/partial-registration-modal/manager/component';
import template from './template';

@layout(template)
export default class HierarchicalListItem extends Component {
    manager!: HierarchicalListItemManager;
    listManager!: PartialRegistrationModalManager;
}
