import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { click } from 'ember-osf-web/tests/helpers';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import moment from 'moment';
import { module, test } from 'qunit';

module('Integration | routes | meetings | detail | -components | meeting-detail-header', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('it renders for meetings accepting both type one and type two submissions', async function(assert) {
        server.create('meeting', {
            id: 'testmeeting',
            name: 'Test Meeting',
            isAcceptingTypeOne: true,
            isAcceptingTypeTwo: true,
        });
        const meeting = await this.store.findRecord('meeting', 'testmeeting');
        this.set('meeting', meeting);
        await render(hbs`<Meetings::Detail::-Components::MeetingDetailHeader @meeting={{this.meeting}} />`);
        assert.dom('[data-test-meeting-name]').hasText(meeting.name);
        assert.dom('[data-test-meeting-logo]').hasAttribute('src', meeting.logoUrl);
        assert.dom('[data-test-meeting-toggle-panel-button]').hasText(`Add your ${meeting.fieldNames.add_submission}`);
        assert.dom('[data-test-meeting-info-url]').hasText(meeting.fieldNames.homepage_link_text);
        assert.dom('[data-test-meeting-info-url]').hasAttribute('href', meeting.infoUrl);
        assert.dom('[data-test-meeting-panel-header]').doesNotExist();
        await click('[data-test-meeting-toggle-panel-button]');
        assert.dom('[data-test-meeting-panel-header]').exists();
        assert.dom('[data-test-meeting-panel-header]').hasText(`Add your ${meeting.fieldNames.add_submission}`);
        assert.dom('[data-test-meeting-send-email]').exists();
        assert.dom('[data-test-meeting-email-address-line]').hasTextContaining(meeting.typeOneSubmissionEmail);
        assert.dom('[data-test-meeting-email-address-line]').hasTextContaining(meeting.typeTwoSubmissionEmail);
        assert.dom('[data-test-meeting-format-header]').exists();
        assert.dom('[data-test-meeting-format-body]').hasTextContaining(meeting.fieldNames.mail_subject);
        assert.dom('[data-test-meeting-format-body]').hasTextContaining(meeting.fieldNames.mail_message_body);
        assert.dom('[data-test-meeting-format-body]').hasTextContaining(meeting.fieldNames.mail_attachment);
        assert.dom('[data-test-meeting-panel-footer-note]').exists();
    });

    test('it renders for meetings accepting only type one submissions', async function(assert) {
        server.create('meeting', {
            id: 'testmeeting',
            name: 'Test Meeting',
            isAcceptingTypeOne: true,
            isAcceptingTypeTwo: false,
        });
        const meeting = await this.store.findRecord('meeting', 'testmeeting');
        this.set('meeting', meeting);
        await render(hbs`<Meetings::Detail::-Components::MeetingDetailHeader @meeting={{this.meeting}} />`);
        assert.dom('[data-test-meeting-name]').hasText(meeting.name);
        assert.dom('[data-test-meeting-logo]').hasAttribute('src', meeting.logoUrl);
        assert.dom('[data-test-meeting-toggle-panel-button]').hasText(
            `Add your ${meeting.fieldNames.submission1_plural}`,
        );
        assert.dom('[data-test-meeting-info-url]').hasText(meeting.fieldNames.homepage_link_text);
        assert.dom('[data-test-meeting-info-url]').hasAttribute('href', meeting.infoUrl);
        assert.dom('[data-test-meeting-panel-header]').doesNotExist();
        await click('[data-test-meeting-toggle-panel-button]');
        assert.dom('[data-test-meeting-panel-header]').exists();
        assert.dom('[data-test-meeting-panel-header]').hasText(`Add your ${meeting.fieldNames.submission1_plural}`);
        assert.dom('[data-test-meeting-send-email]').exists();
        assert.dom('[data-test-meeting-email-address-line]').hasTextContaining(meeting.typeOneSubmissionEmail);
        assert.dom('[data-test-meeting-email-address-line]').doesNotContainText(meeting.typeTwoSubmissionEmail);
        assert.dom('[data-test-meeting-format-header]').exists();
        assert.dom('[data-test-meeting-format-body]').hasTextContaining(meeting.fieldNames.mail_subject);
        assert.dom('[data-test-meeting-format-body]').hasTextContaining(meeting.fieldNames.mail_message_body);
        assert.dom('[data-test-meeting-format-body]').hasTextContaining(meeting.fieldNames.mail_attachment);
        assert.dom('[data-test-meeting-panel-footer-note]').exists();
    });

    test('it renders for meetings accepting only type two submissions', async function(assert) {
        server.create('meeting', {
            id: 'testmeeting',
            name: 'Test Meeting',
            isAcceptingTypeOne: false,
            isAcceptingTypeTwo: true,
        });
        const meeting = await this.store.findRecord('meeting', 'testmeeting');
        this.set('meeting', meeting);
        await render(hbs`<Meetings::Detail::-Components::MeetingDetailHeader @meeting={{this.meeting}} />`);
        assert.dom('[data-test-meeting-name]').hasText(meeting.name);
        assert.dom('[data-test-meeting-logo]').hasAttribute('src', meeting.logoUrl);
        assert.dom('[data-test-meeting-toggle-panel-button]').hasText(
            `Add your ${meeting.fieldNames.submission2_plural}`,
        );
        assert.dom('[data-test-meeting-info-url]').hasText(meeting.fieldNames.homepage_link_text);
        assert.dom('[data-test-meeting-info-url]').hasAttribute('href', meeting.infoUrl);
        assert.dom('[data-test-meeting-panel-header]').doesNotExist();
        await click('[data-test-meeting-toggle-panel-button]');
        assert.dom('[data-test-meeting-panel-header]').exists();
        assert.dom('[data-test-meeting-panel-header]').hasText(`Add your ${meeting.fieldNames.submission2_plural}`);
        assert.dom('[data-test-meeting-send-email]').exists();
        assert.dom('[data-test-meeting-email-address-line]').doesNotContainText(meeting.typeOneSubmissionEmail);
        assert.dom('[data-test-meeting-email-address-line]').hasTextContaining(meeting.typeTwoSubmissionEmail);
        assert.dom('[data-test-meeting-format-header]').exists();
        assert.dom('[data-test-meeting-format-body]').hasTextContaining(meeting.fieldNames.mail_subject);
        assert.dom('[data-test-meeting-format-body]').hasTextContaining(meeting.fieldNames.mail_message_body);
        assert.dom('[data-test-meeting-format-body]').hasTextContaining(meeting.fieldNames.mail_attachment);
        assert.dom('[data-test-meeting-panel-footer-note]').exists();
    });

    test('it handles location and dates properly', async function(assert) {
        server.create('meeting', {
            id: 'testmeeting',
            name: 'Test Meeting',
            location: undefined,
            startDate: undefined,
            endDate: undefined,
        });
        const meeting = await this.store.findRecord('meeting', 'testmeeting');
        this.set('meeting', meeting);
        await render(hbs`<Meetings::Detail::-Components::MeetingDetailHeader @meeting={{this.meeting}} />`);
        assert.dom('[data-test-meeting-location-and-date]')
            .hasText(
                '',
                'Nothing displayed when no location or dates defined',
            );
        const location = 'Timbuktu';
        meeting.set('location', location);
        await settled();
        assert.dom('[data-test-meeting-location-and-date]')
            .hasText(
                location,
                'Only location displayed when only location is defined',
            );
        const startDate = new Date('2000-01-02');
        const formattedStartDate = moment(startDate).format('MMM DD, YYYY');
        meeting.set('startDate', startDate);
        await settled();
        assert.dom('[data-test-meeting-location-and-date]')
            .hasText(
                `${location} | ${formattedStartDate} -`,
                'Only location and start date displayed when only location and start date are defined',
            );
        const endDate = new Date('2000-01-03');
        const formattedEndDate = moment(endDate).format('MMM DD, YYYY');
        meeting.set('endDate', endDate);
        meeting.set('startDate', undefined);
        await settled();
        assert.dom('[data-test-meeting-location-and-date]')
            .hasText(
                `${location} | - ${formattedEndDate}`,
                'Only location and end date displayed when only location and end date are defined',
            );
        meeting.set('location', undefined);
        await settled();
        assert.dom('[data-test-meeting-location-and-date]')
            .hasText(
                `- ${formattedEndDate}`,
                'Only end date displayed when only end date is defined',
            );
        meeting.set('startDate', startDate);
        meeting.set('endDate', undefined);
        await settled();
        assert.dom('[data-test-meeting-location-and-date]')
            .hasText(
                `${formattedStartDate} -`,
                'Only start date displayed when only start date is defined',
            );
        meeting.set('endDate', endDate);
        await settled();
        assert.dom('[data-test-meeting-location-and-date]')
            .hasText(
                `${formattedStartDate} - ${formattedEndDate}`,
                'Only start date and end date displayed when only start date and end date are defined',
            );
        meeting.set('location', location);
        await settled();
        assert.dom('[data-test-meeting-location-and-date]')
            .hasText(
                `${location} | ${formattedStartDate} - ${formattedEndDate}`,
                'Location and dates displayed when all are defined',
            );
    });
});
