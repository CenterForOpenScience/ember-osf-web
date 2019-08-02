import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import I18N from 'ember-i18n/services/i18n';
import MeetingModel from 'ember-osf-web/models/meeting';

export default class MeetingDetailHeader extends Component {
    // Required parameters
    meeting!: MeetingModel;

    // Private properties
    @service i18n!: I18N;
    isPanelOpen = false;

    @computed('meeting.{fieldNames,isAcceptingTypeOne,isAcceptingTypeTwo}')
    get addSubmissionText() {
        const { isAcceptingTypeOne, isAcceptingTypeTwo } = this.meeting;
        const addSubmission = this.meeting.fieldNames.add_submission;
        const submissionOnePlural = this.meeting.fieldNames.submission1_plural;
        const submissionTwoPlural = this.meeting.fieldNames.submission2_plural;
        if (isAcceptingTypeOne && isAcceptingTypeTwo) {
            return addSubmission;
        } else if (isAcceptingTypeOne) {
            return submissionOnePlural;
        }
        return submissionTwoPlural;
    }

    @action
    togglePanel() {
        this.toggleProperty('isPanelOpen');
    }
}
