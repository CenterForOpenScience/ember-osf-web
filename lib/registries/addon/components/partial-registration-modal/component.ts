import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';

import { PartialRegistrationModalManager } from 'registries/components/partial-registration-modal/manager/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class PartialRegistrationModal extends Component {
    modalManager!: PartialRegistrationModalManager;
}
