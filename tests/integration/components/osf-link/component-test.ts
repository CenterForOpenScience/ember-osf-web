import { render} from '@ember/test-helpers';
import Ember from 'ember';
// import { pauseTest } from '@ember/test-helpers/setup-context';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';


module('Integration | Component | osf-link', hooks => {
    setupRenderingTest(hooks);

    let orgOnError: any;
    hooks.beforeEach(function() {
        orgOnError = Ember.onerror;
    });
    hooks.afterEach(function() {
        Ember.onerror = orgOnError;
    });

    test('it renders blocks the right way', async assert => {
        await render(hbs`
            <OsfLink
                data-test-get-started-button
                data-analytics-name='Get started button'
                class='btn btn-primary'
                local-class='startButton'
                @target='_blank'
                @href='https://osf.io'
            >
                {{t 'dashboard.getting_started'}}
            </OsfLink>
        `);
        // await pauseTest();
        assert.dom('[data-test-get-started-button]').exists();
        assert.dom('[data-test-get-started-button]').hasText('Getting Started');
        assert.dom('[data-test-get-started-button]').hasClass('btn');
        assert.dom('[data-test-get-started-button]').hasClass('btn-primary');
        assert.dom('[data-test-get-started-button][href$="https://osf.io"]').exists('The href is correct');
    });

    test('it should throw an error without an array @models', async assert => {
        Ember.onerror = (error: Error) => {
            assert.equal(error.message,
                'Assertion Failed: `@models` must be undefined or an array. Consider using the `array` helper.');
        };

        await render(hbs`
            <OsfLink
                @models='error'
                data-test-get-started-button
                data-analytics-name='Get started button'
                class='btn btn-primary'
                local-class='startButton'
                @target='_blank'
                @href='https://osf.io'
            >
                {{t 'dashboard.getting_started'}}
            </OsfLink>
        `);
    });
});
