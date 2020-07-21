// import Service from '@ember/service';
import { fillIn, pauseTest, render, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import CurrentUser from 'ember-osf-web/services/current-user';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';

import { click } from 'ember-osf-web/tests/helpers';
// import faker from 'faker';

import { module, test } from 'qunit';

// const currentUserStub = Service.extend({
//     currentUserId: 'dscf',
//     ajaxHeaders: () => ({}),
// });

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

    // TODO:
    // Check logged in scenario
    // - hovered text is correct
    // - Heading text containts the current logged in user's email
    // - No textbox
    // - "Claim" button is enabled

    // Check logged out scenario
    // - hovered text is correct
    // - Heading text containts the name of the unregistered contrib
    // - has textbox
    // - has error messages
    // - "Claim" button disabled when invalid text inputed
    test('logged in scenario', async function(this: ThisTestContext, assert) {
        const user = server.create('user', { id: 'dscf' });
        server.create('user-email', { primary: true, user });
        const userModel = await this.store.findRecord('user', user.id);
        this.owner.lookup('service:current-user').set('user', userModel);
        this.owner.lookup('service:current-user').set('currentUserId', user.id);

        await render(hbs`<ContributorList::UnregisteredContributor
            @contributor={{this.contrib}} @nodeId={{this.node.id}}/>`);
        assert.dom(this.element).hasText(this.contrib.unregisteredContributor, 'Has correct name');
        await triggerEvent('[data-test-unregistered-contributor-name]', 'mouseover');
        await pauseTest();
        // check the popover
        assert.dom('[data-test-claim-user-tooltip-message]').isVisible('tooltip message is visible');

        await click('[data-test-unregistered-contributor-name]');
        // check the modal
        assert.dom('[data-test-modal-heading]').isVisible();
        assert.dom('[data-test-modal-heading]').containsText(this.contrib.email);
        assert.dom('[data-test-modal-main]').isVisible();
        assert.dom('[data-test-modal-cancel-button]').isVisible();
        assert.dom('[data-test-modal-claim-button]').isVisible();
        assert.dom('[data-test-email-input]').doesNotExist();
    });

    test('logged out scenario', async function(this: ThisTestContext, assert) {
        await render(hbs`<ContributorList::UnregisteredContributor
            @contributor={{this.contrib}} @nodeId={{this.node.id}}/>`);
        assert.dom(this.element).hasText('Lou Bega', 'Has correct name');
        await triggerEvent('[data-test-unregistered-contributor-name]', 'mouseover');
        // check the popover
        assert.dom('[data-test-claim-user-tooltip-message]').isVisible();

        await click('[data-test-unregistered-contributor-name]');
        // check the modal
        assert.dom('[data-test-modal-heading]').isVisible();
        assert.dom('[data-test-modal-heading]').doesNotContainText(this.contrib.email);
        assert.dom('[data-test-modal-heading]').containsText(this.contrib.users.fullName);
        assert.dom('[data-test-modal-main]').isVisible();
        assert.dom('[data-test-modal-cancel-button]').isVisible();
        assert.dom('[data-test-modal-claim-button]').isVisible();
        assert.dom('[data-test-modal-claim-button]').isDisabled();
        assert.dom('[data-test-email-input]').exists();

        await fillIn('[data-test-email-input]', 'lou bega');
        assert.dom('[data-test-modal-claim-button]').isDisabled();

        await fillIn('[data-test-email-input]', 'lou.bega@bega.lou');
        assert.dom('[data-test-modal-claim-button]').isEnabled();
    });
});
