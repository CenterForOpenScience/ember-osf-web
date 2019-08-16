import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';

import { HierarchicalListManager } from 'osf-components/components/registries/hierarchical-list';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class PartialRegistrationModal extends Component {
    modalManager!: HierarchicalListManager;
}
