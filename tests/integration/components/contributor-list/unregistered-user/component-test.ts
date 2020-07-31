import { fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import CurrentUser from 'ember-osf-web/services/current-user';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { click } from 'ember-osf-web/tests/helpers';

interface ThisTestContext extends TestContext {
    contrib: { email: string, unregisteredContributor: string, users: { fullName: string } };
    currentUser: CurrentUser;
}

module('Integration | Component | contributor-list/unregistered-user', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ThisTestContext) {
        const node = server.create('registration',
            { registrationSchema: server.schema.registrationSchemas.find('testSchema') },
            'withContributors');
        const contrib = server.create('contributor', { node }, 'unregistered');
        this.store = this.owner.lookup('service:store');
        this.setProperties({ contrib, node });
    });

    test('logged in scenario', async function(this: ThisTestContext, assert) {
        const mirageUser = server.create('user');
        const email = server.create('user-email', { primary: true, user: mirageUser });
        const user = await this.store.findRecord('user', mirageUser.id);
        this.owner.lookup('service:current-user').setProperties({ user, currentUserId: user.id });

        await render(hbs`<ContributorList::UnregisteredContributor
            @contributor={{this.contrib}} @nodeId={{this.node.id}}/>`);
        assert.dom(this.element).hasText(this.contrib.unregisteredContributor, 'Has unregistered contrib name');

        await click('[data-test-unregistered-contributor-name]');
        // check the modal
        assert.dom('[data-test-modal-heading]').isVisible('Modal heading is visible');
        assert.dom('[data-test-modal-heading]').containsText(email.emailAddress,
            'Modal heading contains unreg. contrib email');
        assert.dom('[data-test-modal-main]').isVisible('Modal main is visible');
        assert.dom('[data-test-modal-cancel-button]').isVisible();
        assert.dom('[data-test-modal-claim-button]').isEnabled();
        assert.dom('[data-test-modal-claim-button]').isVisible();
        assert.dom('[data-test-email-input]').doesNotExist('Claim email input does not exist');
    });

    test('logged out scenario', async function(this: ThisTestContext, assert) {
        this.owner.lookup('service:current-user').setProperties({ user: null, currentUserId: null });
        await render(hbs`<ContributorList::UnregisteredContributor
            @contributor={{this.contrib}} @nodeId={{this.node.id}}/>`);
        assert.dom(this.element).hasText(this.contrib.unregisteredContributor, 'Has unregistered contrib name');

        await click('[data-test-unregistered-contributor-name]');
        // check the modal
        assert.dom('[data-test-modal-heading]').isVisible();
        assert.dom('[data-test-modal-heading]').doesNotContainText(this.contrib.email);
        assert.dom('[data-test-modal-heading]').containsText(
            this.contrib.unregisteredContributor,
            'Modal heading contains unreg. contrib name',
        );
        assert.dom('[data-test-modal-main]').isVisible();
        assert.dom('[data-test-modal-cancel-button]').isVisible();
        assert.dom('[data-test-modal-claim-button]').isVisible();
        assert.dom('[data-test-modal-claim-button]').isEnabled('Claim button is enabled before we validate');
        await click('[data-test-modal-claim-button]');
        assert.dom('[data-test-modal-claim-button]').isDisabled('Claim button is disabled after we validate');

        assert.dom('[data-test-email-input]').exists('Claim email input exists');

        await fillIn('[data-test-email-input]', 'lou.bega@bega.lou');
        assert.dom('[data-test-unreg-contrib-validation-error]').doesNotExist('Has valid email address');
        assert.dom('[data-test-modal-claim-button]').isEnabled('Claim button is now enabled');

        await fillIn('[data-test-email-input]', 'lou bega');
        assert.dom('[data-test-unreg-contrib-validation-error]').isVisible('Has invalid email address');
        assert.dom('[data-test-modal-claim-button]').isDisabled('Claim button is disabled');
    });
});
