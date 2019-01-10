import { click, render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import sinon, { SinonStub } from 'sinon';

interface AnalyticsTestContext extends TestContext {
    trackEventStub: SinonStub;
}

module('Integration | Analytics handling', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: AnalyticsTestContext) {
        const analytics = this.owner.lookup('service:analytics');
        this.trackEventStub = sinon.stub(analytics.metrics, 'trackEvent');
    });

    test('handle click', async function(this: AnalyticsTestContext, assert) {
        await render(hbs`
            <div data-analytics-scope='Scope!'>
                <button data-analytics-name='Button!'></button>
            </div>
        `);

        await click('button');

        assert.deepEqual(this.trackEventStub.args, [
            [{
                category: 'button',
                action: 'click',
                label: 'Scope! - Button!',
                extra: undefined,
            }],
        ], 'One click event');
    });

    test('extra', async function(this: AnalyticsTestContext, assert) {
        await render(hbs`
            <div data-analytics-scope='Scope!'>
                <button
                    data-analytics-name='Button!'
                    data-analytics-extra='Foo'
                ></button>
            </div>
        `);

        await click('button');

        assert.deepEqual(this.trackEventStub.args, [
            [{
                category: 'button',
                action: 'click',
                label: 'Scope! - Button!',
                extra: 'Foo',
            }],
        ], 'One click event');
    });

    test('duplicate events', async function(this: AnalyticsTestContext, assert) {
        await render(hbs`
            <div data-analytics-scope='Scope!'>
                <button data-analytics-name='Button!'></button>
            </div>
        `);

        await click('button');
        await click('button');

        assert.deepEqual(this.trackEventStub.args, [
            [{
                category: 'button',
                action: 'click',
                label: 'Scope! - Button!',
                extra: undefined,
            }], [{
                category: 'button',
                action: 'click',
                label: 'Scope! - Button!',
                extra: undefined,
            }],
        ], 'Two click events');
    });

    test('nested scope', async function(this: AnalyticsTestContext, assert) {
        await render(hbs`
            <div data-analytics-scope='Scope 1'>
            <div>
            <div data-analytics-scope='Scope 2'>
            <div>
            <div>
            <div>
            <div data-analytics-scope='Scope 3'>
                <button data-analytics-name='Button!'></button>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
        `);

        await click('button');

        assert.deepEqual(this.trackEventStub.args, [
            [{
                category: 'button',
                action: 'click',
                label: 'Scope 1 - Scope 2 - Scope 3 - Button!',
                extra: undefined,
            }],
        ], 'One click event with nested scopes');
    });

    test('multiple targets', async function(this: AnalyticsTestContext, assert) {
        await render(hbs`
            <div data-analytics-scope='Scope 1'>
                <div data-analytics-scope='Scope 2'>
                    <button data-analytics-name='Button!'></button>
                </div>
                <div data-analytics-scope='Scope 3'>
                    <a data-analytics-name='Link!'></a>
                </div>
            </div>
        `);

        await click('a');
        await click('button');

        assert.deepEqual(this.trackEventStub.args, [
            [{
                category: 'link',
                action: 'click',
                label: 'Scope 1 - Scope 3 - Link!',
                extra: undefined,
            }], [{
                category: 'button',
                action: 'click',
                label: 'Scope 1 - Scope 2 - Button!',
                extra: undefined,
            }],
        ], 'One button, one link');
    });

    test('category inference', async function(this: AnalyticsTestContext, assert) {
        await render(hbs`
            <div data-analytics-scope='Scope!'>
                <button data-analytics-name='Button!'></button>
                <a data-analytics-name='Link!'></a>
                <a role='button' data-analytics-name='Button link!'></a>
                <input type='checkbox' data-analytics-name='Checkbox!' />
                <input type='radio' data-analytics-name='Radio' />
                <button
                    id='explicit-category'
                    data-analytics-name='Other button!'
                    data-analytics-category='other'
                ></button>
            </div>
        `);

        await click('button');
        await click('a');
        await click('a[role="button"]');
        await click('input[type="checkbox"]');
        await click('#explicit-category');

        assert.deepEqual(this.trackEventStub.args, [
            [{
                category: 'button',
                action: 'click',
                label: 'Scope! - Button!',
                extra: undefined,
            }],
            [{
                category: 'link',
                action: 'click',
                label: 'Scope! - Link!',
                extra: undefined,
            }],
            [{
                category: 'button',
                action: 'click',
                label: 'Scope! - Button link!',
                extra: undefined,
            }],
            [{
                category: 'checkbox',
                action: 'click',
                label: 'Scope! - Checkbox!',
                extra: undefined,
            }],
            [{
                category: 'other',
                action: 'click',
                label: 'Scope! - Other button!',
                extra: undefined,
            }],
        ], 'Correct categories');
    });

    test('ignore click with no name', async function(this: AnalyticsTestContext, assert) {
        await render(hbs`
            <div data-analytics-scope='Scope!'>
                <button></button>
            </div>
        `);

        await click('button');

        assert.ok(this.trackEventStub.notCalled, 'click ignored');
    });

    test('ignore click with no scope', async function(this: AnalyticsTestContext, assert) {
        await render(hbs`
            <div>
                <button data-analytics-name='Button!'></button>
            </div>
        `);

        await click('button');

        assert.ok(this.trackEventStub.notCalled, 'click ignored');
    });
});
