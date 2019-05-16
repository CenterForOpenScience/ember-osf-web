import { click, render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | meetings-hero-banner', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async assert => {
        await render(hbs`<Meetings::Index::-Components::MeetingsHeroBanner />`);
        assert.dom('[data-test-hero-banner-container]').exists({ count: 1 }, '1 hero banner container');
        assert.dom('[data-test-osf-meeting-img]').exists({ count: 1 }, '1 osf-meeting image');
        assert.dom('[data-test-fa-icon-users]').exists({ count: 1 }, '1 fa-users icon');
        assert.dom('[data-test-fa-icon-cloud-upload]').exists({ count: 1 }, '1 fa-cloud-upload icon');
    });

    test('button click open panels', async assert => {
        await render(hbs`<Meetings::Index::-Components::MeetingsHeroBanner />`);
        assert.dom('[data-test-register-panel-text]').doesNotExist();
        assert.dom('[data-test-upload-panel-text]').doesNotExist();
        await click('[data-test-register-button]');
        await click('[data-test-upload-button]');
        assert.dom('[data-test-register-panel-text]').exists({ count: 1 }, '1 register panel text');
        assert.dom('[data-test-upload-panel-text]').exists({ count: 1 }, '1 upload panel text');
        await click('[data-test-register-button]');
        await click('[data-test-upload-button]');
        assert.dom('[data-test-register-panel-text]').doesNotExist();
        assert.dom('[data-test-upload-panel-text]').doesNotExist();
    });
});
