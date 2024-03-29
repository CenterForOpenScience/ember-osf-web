import { render} from '@ember/test-helpers';
import Ember from 'ember';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';


module('Integration | Component | osf-link', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    let orgOnError: any;
    hooks.beforeEach(function() {
        orgOnError = Ember.onerror;
    });
    hooks.afterEach(function() {
        Ember.onerror = orgOnError;
    });

    test('it renders the osf-link correctly for an @href', async function(assert) {
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
        assert.dom('[data-test-get-started-button]').exists();
        assert.dom('[data-test-get-started-button]').hasText('Getting Started');
        assert.dom('[data-test-get-started-button]').hasClass('btn');
        assert.dom('[data-test-get-started-button]').hasClass('btn-primary');
        assert.dom('[data-test-get-started-button][href$="https://osf.io"]')
            .exists('The href https://osf.io is in the dom');
    });

    test('it renders the osf-link correctly for an empty @href', async function(assert) {
        await render(hbs`
            <OsfLink
                data-test-get-started-button
                data-analytics-name='Get started button'
                class='btn btn-primary'
                local-class='startButton'
                @target='_blank'
                @href=' '
            >
                {{t 'dashboard.getting_started'}}
            </OsfLink>
        `);
        assert.dom('[data-test-get-started-button]').exists();
        assert.dom('[data-test-get-started-button]').hasText('Getting Started');
        assert.dom('[data-test-get-started-button]').hasClass('btn');
        assert.dom('[data-test-get-started-button]').hasClass('btn-primary');
        assert.dom('[data-test-get-started-button][href$=" "]')
            .exists('The empty href is in the dom');
    });

    test('it should throw an error without an array @models', async function(assert) {
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

    test('it should throw an error without an @href or @route', async function(assert) {
        Ember.onerror = (error: Error) => {
            assert.equal(error.message,
                'Assertion Failed: Must pass `@href` xor `@route`. Did you pass `href` instead of `@href`?');
        };

        await render(hbs`
            <OsfLink
                data-test-get-started-button
                data-analytics-name='Get started button'
                class='btn btn-primary'
                local-class='startButton'
                @target='_blank'
            >
                {{t 'dashboard.getting_started'}}
            </OsfLink>
        `);
    });

    test('it should throw an error with @href and @route set to empty', async function(assert) {
        Ember.onerror = (error: Error) => {
            assert.equal(error.message,
                'Assertion Failed: Both `@href` and `@route` were improperly set (probably to empty strings)');
        };

        await render(hbs`
            <OsfLink
                data-test-get-started-button
                data-analytics-name='Get started button'
                class='btn btn-primary'
                local-class='startButton'
                @target='_blank'
                @href=''
                @route=''
            >
                {{t 'dashboard.getting_started'}}
            </OsfLink>
        `);
    });

    test('it should throw an error with @models and not @route', async function(assert) {
        Ember.onerror = (error: Error) => {
            assert.equal(error.message,
                'Assertion Failed: `@models` makes sense only with `@route`');
        };

        await render(hbs`
            <OsfLink
                data-test-get-started-button
                data-analytics-name='Get started button'
                class='btn btn-primary'
                local-class='startButton'
                @target='_blank'
                @href='should pass'
                @models={{array 'hello'}}
            >
                {{t 'dashboard.getting_started'}}
            </OsfLink>
        `);
    });

});
