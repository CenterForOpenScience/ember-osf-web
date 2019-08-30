import { click, render, settled } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | partial-registration-modal', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders a hierarchical list with root already selected', async function(assert) {
        this.store = this.owner.lookup('service:store');
        const root = server.create('node');
        const child = server.create('node', { parent: root });
        const grandChild = server.create('node', { parent: child });

        const rootNode = await this.store.findRecord('node', root.id);
        this.set('rootNode', rootNode);
        this.set('isOpen', false);
        await render(hbs`
            <Registries::PartialRegistrationModal::Manager
                @rootNode={{this.rootNode}}
                @isOpen={{this.isOpen}}
                @renderInPlace={{true}}
                as |modalManager|
            >
                <Registries::PartialRegistrationModal @modalManager={{modalManager}} />
            </Registries::PartialRegistrationModal::Manager>
        `);
        this.set('isOpen', true);
        await settled();
        assert.dom(`[data-test-item="${root.id}"]`).exists();
        assert.dom(`[data-test-item="${child.id}"]`).exists();
        assert.dom(`[data-test-item="${grandChild.id}"]`).exists();
        assert.dom(`[data-test-item="${root.id}"] input`).isChecked();
        this.set('isOpen', false);
        await settled();
    });

    test('select child selects parent; deselect parent deselects children', async function(assert) {
        this.store = this.owner.lookup('service:store');
        const root = server.create('node');
        const child = server.create('node', { parent: root });
        const grandChild = server.create('node', { parent: child });
        const rootNode = await this.store.findRecord('node', root.id);
        this.set('rootNode', rootNode);
        this.set('isOpen', false);
        await render(hbs`
            <Registries::PartialRegistrationModal::Manager
                @rootNode={{this.rootNode}}
                @isOpen={{this.isOpen}}
                @renderInPlace={{true}}
                as |modalManager|
            >
                <Registries::PartialRegistrationModal @modalManager={{modalManager}} />
            </Registries::PartialRegistrationModal::Manager>
        `);
        this.set('isOpen', true);
        await settled();
        assert.dom(`[data-test-item="${grandChild.id}"] input`).isChecked();
        assert.dom(`[data-test-item="${child.id}"] input`).isChecked();
        await click(`[data-test-item="${child.id}"] input`);
        assert.dom(`[data-test-item="${grandChild.id}"] input`).isNotChecked();
        assert.dom(`[data-test-item="${child.id}"] input`).isNotChecked();
        await click(`[data-test-item="${grandChild.id}"] input`);
        assert.dom(`[data-test-item="${grandChild.id}"] input`).isChecked();
        assert.dom(`[data-test-item="${child.id}"] input`).isChecked();
        this.set('isOpen', false);
        await settled();
    });

    test('select all works, while clear all should not clear root node', async function(assert) {
        this.store = this.owner.lookup('service:store');
        const root = server.create('node');
        const child = server.create('node', { parent: root });
        const grandChild = server.create('node', { parent: child });
        const rootNode = await this.store.findRecord('node', root.id);
        this.set('rootNode', rootNode);
        this.set('isOpen', false);
        await render(hbs`
            <Registries::PartialRegistrationModal::Manager
                @rootNode={{this.rootNode}}
                @isOpen={{this.isOpen}}
                @renderInPlace={{true}}
                as |modalManager|
            >
                <Registries::PartialRegistrationModal @modalManager={{modalManager}} />
            </Registries::PartialRegistrationModal::Manager>
        `);
        this.set('isOpen', true);
        await settled();
        assert.dom(`[data-test-item="${root.id}"] input`).isChecked();
        assert.dom(`[data-test-item="${grandChild.id}"] input`).isChecked();
        assert.dom(`[data-test-item="${child.id}"] input`).isChecked();
        await click('[data-test-clear-all]');
        assert.dom(`[data-test-item="${root.id}"] input`).isChecked();
        assert.dom(`[data-test-item="${grandChild.id}"] input`).isNotChecked();
        assert.dom(`[data-test-item="${child.id}"] input`).isNotChecked();
        await click('[data-test-select-all]');
        assert.dom(`[data-test-item="${root.id}"] input`).isChecked();
        assert.dom(`[data-test-item="${grandChild.id}"] input`).isChecked();
        assert.dom(`[data-test-item="${child.id}"] input`).isChecked();
        this.set('isOpen', false);
        await settled();
    });
});
