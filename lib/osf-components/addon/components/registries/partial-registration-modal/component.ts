import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
// tslint:disable-next-line:max-line-length
import {
    PartialRegistrationModalManager,
} from 'osf-components/components/registries/partial-registration-modal/manager/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class PartialRegistrationModal extends Component {
    modalManager!: PartialRegistrationModalManager;
}
