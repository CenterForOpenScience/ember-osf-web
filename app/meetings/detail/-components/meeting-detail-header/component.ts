import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import MeetingModel from 'ember-osf-web/models/meeting';

export default class MeetingDetailHeader extends Component {
    // Required parameters
    meeting!: MeetingModel;

    // Private properties
    @service intl!: Intl;

    isPanelOpen = false;

    @computed('meeting.{fieldNames,isAcceptingTypeOne,isAcceptingTypeTwo}')
    get addSubmissionText() {
        const { isAcceptingTypeOne, isAcceptingTypeTwo } = this.meeting;
        const addSubmission = this.meeting.fieldNames.add_submission;
        const submissionOnePlural = this.meeting.fieldNames.submission1_plural;
        const submissionTwoPlural = this.meeting.fieldNames.submission2_plural;
        if (isAcceptingTypeOne && isAcceptingTypeTwo) {
            return addSubmission;
        } if (isAcceptingTypeOne) {
            return submissionOnePlural;
        }
        return submissionTwoPlural;
    }

    @action
    togglePanel() {
        this.toggleProperty('isPanelOpen');
    }
}
