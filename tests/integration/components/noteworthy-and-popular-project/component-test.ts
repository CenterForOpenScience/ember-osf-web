import { render } from '@ember/test-helpers';
import { manualSetup } from 'ember-data-factory-guy';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import FakeNode from '../../helpers/fake-node';

module('Integration | Component | noteworthy-and-popular-project', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        manualSetup(this);
    });

    test('it renders', async function(assert) {
        const node = new FakeNode();
        this.set('project', node);
        await render(hbs`{{noteworthy-and-popular-project project=project}}`);
        assert.dom('[class*="NoteworthyProject"]').exists();
    });
});
