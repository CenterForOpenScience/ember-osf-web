import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import faker from 'faker';

import { module, test } from 'qunit';
import { OsfLinkRouterStub } from '../../helpers/osf-link-router-stub';

module('Integration | Component | node-description', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
    });
    test('it renders', async function(assert) {
        this.owner.register('service:router', OsfLinkRouterStub);
        const node = server.create('node', {}, 'withContributors');
        const project = await this.store.findRecord('node', node.id, { include: 'bibliographic_contributors' });
        this.set('node', project);

        // do the short description first
        const shortDescription = faker.lorem.sentences(2);
        this.set('manager', { description: shortDescription });
        await render(hbs`<NodeDescription @manager={{this.manager}} />`);
        assert.dom('[data-test-node-description-wrapper]').containsText(shortDescription);
        assert.dom('[data-test-node-description-overlay]').doesNotExist('no overlay needed');
        assert.dom('[data-test-node-description-button]').doesNotExist('button does not show up');

        // change it to a longer description
        const longDescription = faker.lorem.sentences(500);
        this.set('manager', { description: longDescription });
        await render(hbs`<NodeDescription @manager={{this.manager}}  />`);
        assert.dom('[data-test-node-description-wrapper]').containsText(longDescription);
        assert.dom('[data-test-node-description-overlay]').exists('overlay needed');
        assert.dom('[data-test-node-description-button]').exists('button shows up');
        assert.dom('[data-test-node-description-wrapper]').hasStyle({
            maxHeight: '200px',
        });

        // click the "See more" button
        await click('[data-test-node-description-button]');
        assert.dom('[data-test-node-description-wrapper]').hasStyle({
            maxHeight: 'none',
        });
    });
});
