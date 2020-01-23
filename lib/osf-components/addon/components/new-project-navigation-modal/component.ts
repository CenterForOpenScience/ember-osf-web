import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class NewProjectNavigationModal extends Component {
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
