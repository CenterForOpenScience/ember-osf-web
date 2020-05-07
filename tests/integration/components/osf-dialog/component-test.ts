import { click as untrackedClick, render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { click } from 'ember-osf-web/tests/helpers';
import { TestContext } from 'ember-test-helpers';

interface DialogTestContext extends TestContext {
    isOpen: boolean;
}

module('Integration | Component | osf-dialog', hooks => {
    setupRenderingTest(hooks);

    test('it renders blocks the right way', async assert => {
        await render(hbs`<OsfDialog @renderInPlace={{true}} as |dialog|>
            <dialog.trigger>
                <button test-open-dialog {{on 'click' dialog.open}}>Click me!</button>
            </dialog.trigger>
            <dialog.heading>
                <span test-heading>Here is a heading</span>
            </dialog.heading>
            <dialog.main>
                <span test-main>Here is the main content</span>
            </dialog.main>
            <dialog.footer>
                Here is a footer
                <button test-close-dialog {{on 'click' dialog.close}}>Close</button>
            </dialog.footer>
        </OsfDialog>`);

        assert.dom('[test-open-dialog]').exists('Dialog trigger button rendered');
        assert.dom('[data-test-dialog]').doesNotExist('Dialog closed');
        assert.dom('[test-heading]').doesNotExist('Heading block not rendered');
        assert.dom('[test-main]').doesNotExist('Main block not rendered');
        assert.dom('[test-close-dialog]').doesNotExist('Footer block not rendered');

        await untrackedClick('[test-open-dialog]');

        assert.dom('[data-test-dialog]').exists('Dialog open');
        assert.dom('[test-heading]').exists('Heading block rendered');
        assert.dom('[test-main]').exists('Main block rendered');
        assert.dom('[test-close-dialog]').exists('Footer block rendered');

        await untrackedClick('[test-close-dialog]');

        assert.dom('[data-test-dialog]').doesNotExist('Dialog closed');
        assert.dom('[test-heading]').doesNotExist('Heading block not rendered');
        assert.dom('[test-main]').doesNotExist('Main block not rendered');
        assert.dom('[test-close-dialog]').doesNotExist('Footer block not rendered');
    });

    test('can close dialog several ways', async assert => {
        await render(hbs`<OsfDialog @renderInPlace={{true}} as |dialog|>
            <dialog.trigger>
                <button test-open-dialog {{on 'click' dialog.open}}>Click me!</button>
            </dialog.trigger>
            <dialog.heading>
                <button test-heading-close {{on 'click' dialog.close}}>Close</button>
            </dialog.heading>
            <dialog.main>
                <button test-main-close {{on 'click' dialog.close}}>Close</button>
            </dialog.main>
            <dialog.footer>
                <button test-footer-close {{on 'click' dialog.close}}>Close</button>
            </dialog.footer>
        </OsfDialog>`);

        assert.dom('[data-test-dialog]').doesNotExist('Dialog closed');

        await untrackedClick('[test-open-dialog]');
        assert.dom('[data-test-dialog]').exists('Dialog open');

        await click('[data-test-close-dialog]');
        assert.dom('[data-test-dialog]').doesNotExist('Dialog closed by clicking "x"');

        await untrackedClick('[test-open-dialog]');
        assert.dom('[data-test-dialog]').exists('Dialog open');

        await untrackedClick('[data-test-dialog-background]');
        assert.dom('[data-test-dialog]').doesNotExist('Dialog closed by clicking outside');

        await untrackedClick('[test-open-dialog]');
        assert.dom('[data-test-dialog]').exists('Dialog open');

        await untrackedClick('[test-heading-close]');
        assert.dom('[data-test-dialog]').doesNotExist('Dialog closed by clicking custom button in heading block');

        await untrackedClick('[test-open-dialog]');
        assert.dom('[data-test-dialog]').exists('Dialog open');

        await untrackedClick('[test-main-close]');
        assert.dom('[data-test-dialog]').doesNotExist('Dialog closed by clicking custom button in main block');

        await untrackedClick('[test-open-dialog]');
        assert.dom('[data-test-dialog]').exists('Dialog open');

        await untrackedClick('[test-footer-close]');
        assert.dom('[data-test-dialog]').doesNotExist('Dialog closed by clicking custom button in footer block');
    });

    test('can control dialog with @isOpen', async function(this: DialogTestContext, assert) {
        this.set('isOpen', false);

        await render(hbs`<OsfDialog @renderInPlace={{true}} @isOpen={{this.isOpen}} as |dialog|>
            <dialog.heading />
            <dialog.main />
            <dialog.footer />
        </OsfDialog>`);
        assert.dom('[data-test-dialog]').doesNotExist('Dialog closed');

        this.set('isOpen', true);
        await settled();
        assert.dom('[data-test-dialog]').exists('Dialog open');

        this.set('isOpen', false);
        await settled();
        assert.dom('[data-test-dialog]').doesNotExist('Dialog closed');
    });

    test('does not close on outside click', async assert => {
        await render(hbs`<OsfDialog @renderInPlace={{true}} @closeOnOutsideClick={{false}} as |dialog|>
            <dialog.trigger>
                <button test-open-dialog {{on 'click' dialog.open}}>Click me!</button>
            </dialog.trigger>
            <dialog.heading />
            <dialog.main />
            <dialog.footer />
        </OsfDialog>`);

        await untrackedClick('[test-open-dialog]');
        assert.dom('[data-test-dialog]').exists('Dialog open');

        await untrackedClick('[data-test-dialog-background]');
        assert.dom('[data-test-dialog]').exists('Dialog still open');
    });
});
