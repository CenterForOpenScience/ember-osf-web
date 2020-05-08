import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import { layout } from 'ember-osf-web/decorators/component';
import DraftRegistration from 'ember-osf-web/models/draft-registration';
import Analytics from 'ember-osf-web/services/analytics';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class DraftRegistrationCard extends Component {
    @service analytics!: Analytics;

    // Required arguments
    draftRegistration!: DraftRegistration;

    // Optional arguments
    onDelete?: (draftRegistration?: DraftRegistration) => void;

    // Private properties
    deleteModalOpen = false;

    @action
    delete() {
        this.set('deleteModalOpen', true);
    }

    @action
    cancelDelete() {
        this.set('deleteModalOpen', false);
    }

    @action
    async confirmDelete() {
        this.set('deleteModalOpen', false);
        await this.draftRegistration.destroyRecord();
        if (this.onDelete) {
            this.onDelete(this.draftRegistration);
        }
    }
}
