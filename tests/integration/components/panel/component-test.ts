import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

const attrTitle = 'This is a title from an attribute';
const attrBody = 'This is some body text from an attribute';
const attrFooter = 'This is some footer text from an attribute';
const blockTitle = 'This is a title from a block';
const blockBody = 'This is some body text from a block';
const blockFooter = 'This is some footer text from a block';

module('Integration | Component | panel', () => {
    module('invoked using attributes', hooks => {
        setupRenderingTest(hooks);

        hooks.beforeEach(async function(this: TestContext) {
            this.setProperties({ attrTitle, attrBody, attrFooter });
            await render(hbs`
                <Panel as |panel|>
                    <panel.heading @title={{this.attrTitle}} />
                    <panel.body @text={{this.attrBody}} />
                    <panel.footer @text={{this.attrFooter}} />
                </Panel>
            `);
        });

        test('panel', assert => {
            assert.dom('[data-test-panel]')
                .exists('Panel renders');
        });

        test('heading', assert => {
            assert.dom('[data-test-panel-heading]')
                .exists('Panel heading section renders');
            assert.dom('[data-test-panel-heading] [data-test-panel-title]')
                .exists('Panel title section renders inside panel heading section');
            assert.dom('[data-test-panel-title]')
                .hasText(attrTitle, 'Panel title section contains title text');
        });

        test('body', assert => {
            assert.dom('[data-test-panel-body]')
                .exists('Panel body section renders');
            assert.dom('[data-test-panel-body]')
                .hasText(attrBody, 'Panel body section contains body text');
        });

        test('footer', assert => {
            assert.dom('[data-test-panel-footer]')
                .exists('Panel footer section renders');
            assert.dom('[data-test-panel-footer]')
                .hasText(attrFooter, 'Panel footer section contains footer text');
        });
    });

    module('invoked using blocks', hooks => {
        setupRenderingTest(hooks);

        hooks.beforeEach(async function(this: TestContext) {
            this.setProperties({ blockTitle, blockBody, blockFooter });
            await render(hbs`
                <Panel as |panel|>
                    <panel.heading>
                        {{this.blockTitle}}
                    </panel.heading>
                    <panel.body>
                        {{this.blockBody}}
                    </panel.body>
                    <panel.footer>
                        {{this.blockFooter}}
                    </panel.footer>
                </Panel>
            `);
        });

        test('panel', assert => {
            assert.dom('[data-test-panel]').exists('Panel renders');
        });

        test('heading', assert => {
            assert.dom('[data-test-panel-heading]')
                .exists('Panel heading section renders');
            assert.dom('[data-test-panel-title]')
                .doesNotExist('Panel title section does not render');
            assert.dom('[data-test-panel-heading]')
                .hasText(blockTitle, 'Panel heading section contains title text');
        });

        test('body', assert => {
            assert.dom('[data-test-panel-body]')
                .exists('Panel body section renders');
            assert.dom('[data-test-panel-body]')
                .hasText(blockBody, 'Panel body section contains body text');
        });

        test('footer', assert => {
            assert.dom('[data-test-panel-footer]')
                .exists('Panel footer section renders');
            assert.dom('[data-test-panel-footer]')
                .hasText(blockFooter, 'Panel footer section contains footer text');
        });
    });

    module('invoked using both attributes and blocks', hooks => {
        setupRenderingTest(hooks);

        hooks.beforeEach(async function(this: TestContext) {
            this.setProperties({ attrTitle, attrBody, attrFooter, blockTitle, blockBody, blockFooter });
            await render(hbs`
                <Panel as |panel|>
                    <panel.heading @title={{this.attrTitle}}>
                        {{this.blockTitle}}
                    </panel.heading>
                    <panel.body @text={{this.attrBody}}>
                        {{this.blockBody}}
                    </panel.body>
                    <panel.footer @text={{this.attrFooter}}>
                        {{this.blockFooter}}
                    </panel.footer>
                </Panel>
            `);
        });

        test('panel', assert => {
            assert.dom('[data-test-panel]').exists('Panel renders');
        });

        test('heading', assert => {
            assert.dom('[data-test-panel-heading]')
                .exists('Panel heading section renders');
            assert.dom('[data-test-panel-heading] [data-test-panel-title]')
                .exists('Panel title section renders inside panel heading section');
            assert.dom('[data-test-panel-heading]')
                .hasText(
                    `${attrTitle} ${blockTitle}`,
                    'Panel heading section contains title text',
                );
        });

        test('body', assert => {
            assert.dom('[data-test-panel-body]')
                .exists('Panel body section renders');
            assert.dom('[data-test-panel-body]')
                .hasText(
                    `${attrBody} ${blockBody}`,
                    'Panel body section contains body text',
                );
        });

        test('footer', assert => {
            assert.dom('[data-test-panel-footer]')
                .exists('Panel footer section renders');
            assert.dom('[data-test-panel-footer]')
                .hasText(
                    `${attrFooter} ${blockFooter}`,
                    'Panel footer section contains footer text',
                );
        });
    });
});
