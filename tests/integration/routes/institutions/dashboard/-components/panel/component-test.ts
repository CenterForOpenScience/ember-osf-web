import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

module('Integration | routes | institutions | dashboard | -components | panel', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('it renders while loading', async assert => {
        await render(hbs`
            <Institutions::Dashboard::-Components::Panel
                @isLoading={{true}}
                @title='Test'
            >
                Hello, World!
            </Institutions::Dashboard::-Components::Panel>`);

        assert.dom('[data-test-panel-title]')
            .exists({ count: 1 }, '1 title');
        assert.dom('[data-test-panel-title]')
            .hasText('Test');
        assert.dom('[data-test-panel-body]')
            .exists({ count: 1 }, '1 body');
        assert.dom('[data-test-panel-body]')
            .hasText('');
        assert.dom('[data-test-loading-indicator]')
            .exists({ count: 1 }, '1 loading indicator');
    });

    test('it renders after loading', async assert => {
        await render(hbs`
            <Institutions::Dashboard::-Components::Panel
                @isLoading={{false}}
                @title='Test'
            >
                Hello, World!
            </Institutions::Dashboard::-Components::Panel>`);

        assert.dom('[data-test-panel-title]')
            .exists({ count: 1 }, '1 title');
        assert.dom('[data-test-panel-title]')
            .hasText('Test');
        assert.dom('[data-test-panel-body]')
            .exists({ count: 1 }, '1 body');
        assert.dom('[data-test-panel-body]')
            .hasText('Hello, World!');
        assert.dom('[data-test-loading-indicator]')
            .doesNotExist();
    });
});
