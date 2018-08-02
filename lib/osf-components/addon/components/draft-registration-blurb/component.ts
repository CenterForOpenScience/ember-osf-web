import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import config from 'ember-get-config';

import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import DraftRegistration from 'ember-osf-web/models/draft-registration';
import Analytics from 'ember-osf-web/services/analytics';
import pathJoin from 'ember-osf-web/utils/path-join';

import styles from './styles';
import layout from './template';

const { OSF: { url: baseURL } } = config;

@localClassNames('DraftRegistrationBlurb')
export default class DraftRegistrationBlurb extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;

    // Required arguments
    draftRegistration!: DraftRegistration;

    // Optional arguments
    onDelete?: (draftRegistration?: DraftRegistration) => void;
    decrementCount?: () => void;

    // Private properties
    deleteModalOpen = false;

    @computed('draftRegistration.branchedFrom.id', 'draftRegistration.id')
    get draftRegistrationUrl() {
        return pathJoin(baseURL, this.draftRegistration.branchedFrom.get('id'), 'drafts', this.draftRegistration.id);
    }

    @computed('draftRegistration.registrationSchema', 'draftRegistration.registration_metadata')
    get percentComplete() {
        let requiredQuestions = 0;
        let answeredRequiredQuestions = 0;
        const schema = this.draftRegistration.registrationSchema.get('schema');
        if (!schema) {
            return -1;
        }
        schema.pages.forEach(page =>
            page.questions.forEach(question => {
                const { value } = this.draftRegistration.registrationMetadata[question.qid];
                if (question.type === 'object' && question.properties) {
                    question.properties.forEach(property => {
                        if (property.required) {
                            requiredQuestions++;
                            const { value: propertyValue } = value[property.id];
                            if (propertyValue && propertyValue.length) {
                                answeredRequiredQuestions++;
                            }
                        }
                    });
                } else if (question.required) {
                    requiredQuestions++;
                    if (value && value.length) {
                        answeredRequiredQuestions++;
                    }
                }
            }));
        return requiredQuestions ? (answeredRequiredQuestions / requiredQuestions) * 100 : -1;
    }

    @computed('percentComplete')
    get showProgress() {
        return this.percentComplete >= 0;
    }

    @computed('percentComplete')
    get progressStyle() {
        return htmlSafe(`width: ${this.percentComplete}%`);
    }

    @computed('draftRegistration', 'showProgress', 'percentComplete')
    get enableRegister() {
        if (this.draftRegistration) {
            return this.showProgress ? this.percentComplete === 100 : true;
        }
        return false;
    }

    @action
    edit() {
        this.analytics.click('button', 'Draft Registrations - Edit');
        window.location.assign(this.draftRegistrationUrl);
    }

    @action
    delete(this: DraftRegistrationBlurb) {
        this.analytics.click('button', 'Draft Registrations - Delete');
        this.set('deleteModalOpen', true);
    }

    @action
    cancelDelete(this: DraftRegistrationBlurb) {
        this.analytics.click('button', 'Draft Registrations - Cancel Delete');
        this.set('deleteModalOpen', false);
    }

    @action
    async confirmDelete(this: DraftRegistrationBlurb) {
        this.analytics.click('button', 'Draft Registrations - Confirm Delete');
        this.set('deleteModalOpen', false);
        await this.draftRegistration.destroyRecord();
        if (this.onDelete) {
            this.onDelete(this.draftRegistration);
        }
    }

    @action
    register() {
        this.analytics.click('button', 'Draft Registrations - Register');
        window.location.assign(pathJoin(this.draftRegistrationUrl, 'register'));
    }
}
