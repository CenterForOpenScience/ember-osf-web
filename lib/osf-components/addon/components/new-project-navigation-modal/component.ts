import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import requiredAction from 'ember-osf-web/decorators/required-action';
import Analytics from 'ember-osf-web/services/analytics';

import styles from './styles';
import layout from './template';

export default class NewProjectNavigationModal extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;

    // Required arguments
    @requiredAction closeModal!: () => unknown;
    // Optional arguments
    afterStayHere?: () => unknown;

    @action
    stayHere() {
        this.closeModal();
        if (this.afterStayHere) {
            this.afterStayHere();
        }
    }
}
