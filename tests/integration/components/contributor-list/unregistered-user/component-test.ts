import { render, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';

import { click } from 'ember-osf-web/tests/helpers';
// import faker from 'faker';

import { module, test } from 'qunit';

module('Integration | Component | contributor-list/unregistered-user', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        const fakeUser = {
            givenName: 'Lou',
            familyName: 'Bega',
            fullName: 'Lou Bega',
            unregisteredContributor: 'Lou Bega',
        };
        this.set('contrib', { users: fakeUser });

        const fakeNode = {
            id: '12345',
        };
        this.set('node', fakeNode);
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
    test('logged in scenario', async function(assert) {
        await render(hbs`<ContributorList::UnregisteredUser @contributor={{this.contrib}} @nodeId={{this.node.id}}/>`);
        assert.dom(this.element).hasText('Lou Bega', 'Has correct name');
        await triggerEvent('[data-test-unregistered-contributor-name]', 'mouseover');
        // check the popover

        await click('[data-test-unregistered-contributor-name]');
        // check the modal
    });
});
