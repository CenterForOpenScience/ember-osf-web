import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import I18N from 'ember-i18n/services/i18n';
import MeetingModel from 'ember-osf-web/models/meeting';
import moment from 'moment';

export default class MeetingDetailHeader extends Component {
    @service i18n!: I18N;
    meeting!: MeetingModel;
    isPanelOpen: boolean = false;

    @computed('meeting.{startDate,endDate,location}')
    get locationAndDateText() {
        if (!this.meeting) {
            return null;
        }
        const { startDate, endDate, location } = this.meeting;
        let dateString = null;
        if (startDate && endDate) {
            dateString = `${moment(startDate).format('MMMM Do, YYYY')} - ${moment(endDate).format('MMMM Do, YYYY')}`;
        } else {
            dateString = `${moment(startDate).format('MMMM Do YYYY')}`;
        }

        if (location) {
            return `${location} | ${dateString}`;
        }

        return dateString;
    }

    @computed('meeting.{fieldNames,isAcceptingTypeOne,isAcceptingTypeTwo}')
    get panelToggleLinkText() {
        const { isAcceptingTypeOne, isAcceptingTypeTwo } = this.meeting;
        const addSubmission = this.meeting.fieldNames.add_submission;
        const submissionOne = this.meeting.fieldNames.submission1;
        const submissionTwo = this.meeting.fieldNames.submission2;
        const addYour = this.i18n.t('meetings.detail.meeting-detail-header.add_your');
        if (isAcceptingTypeOne && isAcceptingTypeTwo) {
            return `${addYour} ${addSubmission}`;
        } else if (isAcceptingTypeOne) {
            return `${addYour} ${submissionOne}`;
        }
        return `${addYour} ${submissionTwo}`;
    }

    @computed('meeting.{fieldNames,isAcceptingTypeOne,isAcceptingTypeTwo}')
    get panelHeaderText() {
        const { isAcceptingTypeOne, isAcceptingTypeTwo } = this.meeting;
        const addSubmission = this.meeting.fieldNames.add_submission;
        const submissionOnePlural = this.meeting.fieldNames.submission1_plural;
        const submissionTwoPlural = this.meeting.fieldNames.submission2_plural;
        const addYour = this.i18n.t('meetings.detail.meeting-detail-header.add_your');
        if (isAcceptingTypeOne && isAcceptingTypeTwo) {
            return `${addYour} ${addSubmission}`;
        } else if (isAcceptingTypeOne) {
            return `${addYour} ${submissionOnePlural}`;
        }
        return `${addYour} ${submissionTwoPlural}`;
    }

    @computed('meeting.fieldNames')
    get typeOneEmailLineText() {
        return this.i18n.t('meetings.detail.meeting-detail-header.email_text', {
            typeName: this.meeting.fieldNames.submission1_plural,
            emailAddress: this.meeting.typeOneSubmissionEmail,
        });
    }

    @computed('meeting.fieldNames')
    get typeTwoEmailLineText() {
        return this.i18n.t('meetings.detail.meeting-detail-header.email_text', {
            typeName: this.meeting.fieldNames.submission2_plural,
            emailAddress: this.meeting.typeTwoSubmissionEmail,
        });
    }

    @computed('meeting.fieldNames')
    get conferenceHomepageText() {
        if (this.meeting.fieldNames.homepage_link_text) {
            return this.meeting.fieldNames.homepage_link_text;
        }
        return this.i18n.t('meetings.detail.meeting-detail-header.conference_homepage');
    }

    @action
    togglePanel() {
        this.toggleProperty('isPanelOpen');
    }
}
