import { layout } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

@layout(template)
export default class InstitutionWidget extends Component {
    // required parameters
    shouldShowModal: boolean = false;

    // optional parameters
    readOnly: boolean = defaultTo(this.readOnly, false);
    analyticsScope: string = defaultTo(this.analyticsScope, '');

    // private parameters
    styles = styles;
    @service analytics!: Analytics;

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
