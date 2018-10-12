import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import Analytics from 'ember-osf-web/services/analytics';

import styles from './styles';
import layout from './template';

export default class NewProjectNavigationModal extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;
}
