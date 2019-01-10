import { click, render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import sinonTest from 'ember-sinon-qunit/test-support/test';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';
import sinon from 'sinon';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | hyper-link', hooks => {
    setupRenderingTest(hooks);

    test('it renders ember routes', async function(this: TestContext, assert) {
        await render(hbs`{{osf-navbar/x-links/hyper-link foo}}`);

        assert.dom('a').exists();
    });

    test('it renders external hrefs', async function(this: TestContext, assert) {
        await render(hbs`{{osf-navbar/x-links/hyper-link 'http://example.com'}}`);

        assert.dom('a[href="http://example.com"]').exists();
    });

    test('it renders internal hrefs', async function(this: TestContext, assert) {
        await render(hbs`{{osf-navbar/x-links/hyper-link '/'}}`);

        assert.dom('a[href="/"]').exists();
    });

    test('it does not render when hidden=true', async function(this: TestContext, assert) {
        this.set('isHidden', true);

        await render(hbs`{{osf-navbar/x-links/hyper-link hidden=isHidden}}`);

        assert.dom('a').doesNotExist();

        this.set('isHidden', false);
        assert.dom('a').exists();

        this.set('isHidden', true);
        assert.dom('a').doesNotExist();
    });

    test('it renders `text`', async function(this: TestContext, assert) {
        await render(hbs`{{osf-navbar/x-links/hyper-link text='This is my text'}}`);

        assert.dom('a').hasText('This is my text');
    });

    test('it renders yields', async function(this: TestContext, assert) {
        await render(hbs`
            {{#osf-navbar/x-links/hyper-link text='This is my text'}}
                This is not my text
            {{/osf-navbar/x-links/hyper-link}}
        `);

        assert.dom('a').hasText('This is not my text');
    });

    test('it allows overriding route when curried', async function(this: TestContext, assert) {
        await render(hbs`
            {{#let (
                hash
                link=(component 'osf-navbar/x-links/hyper-link' 'http://example.com/#override-me' text='Override Me')
            ) as |ctx|}}
                {{ctx.link route='http://example.com/#overridden' text='Overridden'}}
            {{/let}}
        `);

        assert.dom('a').hasText('Overridden');
        assert.dom('a[href="http://example.com/#overridden"]').exists();
    });

    test('it calls analytics on non-ember routes', async function(this: TestContext) {
        const analytics = sinon.stub(this.owner.lookup('service:analytics'));

        // Prevent Redirects
        analytics.click.callsFake((...args: any[]) => {
            for (const arg of args) {
                if (arg.preventDefault) {
                    arg.preventDefault();
                }
            }
        });

        await render(hbs`
            {{osf-navbar/x-links/hyper-link '/bar' analyticsLabel='This is a test'}}
        `);

        await click('a');

        sinon.assert.calledOnce(analytics.click);
        sinon.assert.calledWith(analytics.click, 'link', 'This is a test');
    });

    sinonTest('it calls analytics on ember routes', async function() {
        const routing = this.owner.lookup('service:-routing');
        const analyticsClick = this.stub(this.owner.lookup('service:analytics'), 'click');

        this.stub(routing, 'transitionTo');

        // Prevent Redirects
        analyticsClick.callsFake((...args: any[]) => {
            for (const arg of args) {
                if (arg.preventDefault) {
                    arg.preventDefault();
                }
            }
        });

        await render(hbs`
            {{osf-navbar/x-links/hyper-link 'foo' analyticsLabel='This is a second test'}}
        `);

        await click('a');

        this.sandbox.assert.calledOnce(analyticsClick);
        this.sandbox.assert.calledOnce(routing.transitionTo);
        this.sandbox.assert.calledWith(analyticsClick, 'link', 'This is a second test');
    });
});
