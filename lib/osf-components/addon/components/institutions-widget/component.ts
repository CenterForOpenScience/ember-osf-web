import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class InstitutionWidget extends Component {
    // optional properties
    readOnly: boolean = defaultTo(this.readOnly, false);
    analyticsScope: string = defaultTo(this.analyticsScope, '');

    // private properties
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    shouldShowModal: boolean = false;

    @action
    showModal() {
        this.set('shouldShowModal', true);
        this.analytics.click('button', `${this.analyticsScope} - Add Affiliation - open_modal`);
    }

    @action
    closeModal() {
        this.set('shouldShowModal', false);
        this.analytics.click('button', `${this.analyticsScope} - Add Affiliation - cancel`);
    }

    @action
    create() {
        return true;
    }
}
