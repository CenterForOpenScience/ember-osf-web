import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';

import {
    HierarchicalListItemManager,
} from 'osf-components/components/registries/hierarchical-list/item-manager/component';
import {
    PartialRegistrationModalManager,
} from 'osf-components/components/registries/partial-registration-modal/manager/component';
import template from './template';

@layout(template)
export default class HierarchicalListItem extends Component {
    manager!: HierarchicalListItemManager;
    listManager!: PartialRegistrationModalManager;
}
