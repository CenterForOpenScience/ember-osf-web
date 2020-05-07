import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { ModelInstance } from 'ember-cli-mirage';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import User from 'ember-osf-web/models/user';

interface ThisTestContext extends TestContext {
    user: ModelInstance<User>;
}

module('Integration | Component | file-browser', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ThisTestContext) {
        const mirageUser = server.create('user');
        this.user = mirageUser;
    });

    test('test name\'s column width', async function(this: ThisTestContext, assert) {
        this.set('user', this.user);
        await render(hbs`{{file-browser  user=user}}`);
        assert.dom('div[class*="column-labels-header"] > div:nth-child(1)').hasClass('col-xs-12');
    });
});
