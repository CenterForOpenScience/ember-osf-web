import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { click } from 'ember-osf-web/tests/helpers';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | routes | meetings | index | -components | meeting-detail-header', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('it renders for meetings accepting both type one and type two submissions', async function(assert) {
        server.create('meeting', {
            id: 'testmeeting',
            name: 'Test Meeting',
            location: 'Guangzhou, Guangdong, CHINA',
            startDate: new Date(2017, 1, 1),
            endDate: new Date(2018, 1, 1),
            isAcceptingTypeOne: true,
            isAcceptingTypeTwo: true,
            typeOneSubmissionEmail: 'typeonefake@cos.io',
            typeTwoSubmissionEmail: 'typetwofake@cos.io',
            active: true,
            logoUrl: 'fakelogourl.com',
            infoUrl: 'inforurl.com',
            fieldNames: {
                mail_message_body: 'mail message body',
                add_submission: 'A\'s and B\'s',
                submission1_plural: 'essays',
                meeting_title_type: 'nvm',
                mail_subject: 'mail subject',
                submission2_plural: 'theses',
                mail_attachment: 'mail attachment',
                submission2: 'song',
                submission1: 'music',
                homepage_link_text: 'homepagelinktext',
            },
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
            location: 'Guangzhou, Guangdong, CHINA',
            startDate: new Date(2017, 1, 1),
            endDate: new Date(2018, 1, 1),
            isAcceptingTypeOne: true,
            isAcceptingTypeTwo: false,
            typeOneSubmissionEmail: 'typeonefake@cos.io',
            typeTwoSubmissionEmail: 'typetwofake@cos.io',
            active: true,
            logoUrl: 'fakelogourl.com',
            infoUrl: 'inforurl.com',
            fieldNames: {
                mail_message_body: 'mail message body',
                add_submission: 'A\'s and B\'s',
                submission1_plural: 'essays',
                meeting_title_type: 'nvm',
                mail_subject: 'mail subject',
                submission2_plural: 'theses',
                mail_attachment: 'mail attachment',
                submission2: 'song',
                submission1: 'music',
                homepage_link_text: 'homepagelinktext',
            },
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
            location: 'Guangzhou, Guangdong, CHINA',
            startDate: new Date(2017, 1, 1),
            endDate: new Date(2018, 1, 1),
            isAcceptingTypeOne: false,
            isAcceptingTypeTwo: true,
            typeOneSubmissionEmail: 'typeonefake@cos.io',
            typeTwoSubmissionEmail: 'typetwofake@cos.io',
            active: true,
            logoUrl: 'fakelogourl.com',
            infoUrl: 'inforurl.com',
            fieldNames: {
                mail_message_body: 'mail message body',
                add_submission: 'A\'s and B\'s',
                submission1_plural: 'essays',
                meeting_title_type: 'nvm',
                mail_subject: 'mail subject',
                submission2_plural: 'theses',
                mail_attachment: 'mail attachment',
                submission2: 'song',
                submission1: 'music',
                homepage_link_text: 'homepagelinktext',
            },
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
});
