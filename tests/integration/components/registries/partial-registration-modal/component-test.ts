import { click, render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import NodeModel from 'ember-osf-web/models/node';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | partial-registration-modal', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders a hierarchical list with root already selected', async function(assert) {
        assert.expect(8);
        this.store = this.owner.lookup('service:store');
        const root = server.create('node');
        const child = server.create('node', { parent: root });
        const grandChild = server.create('node', { parent: child });

        const rootNode = await this.store.findRecord('node', root.id);
        const childNode = await this.store.findRecord('node', child.id);
        const grandChildNode = await this.store.findRecord('node', grandChild.id);
        this.set('rootNode', rootNode);
        this.set('isOpen', false);
        this.set('onContinue', (selectedNodes: NodeModel[]) => {
            assert.ok(
                selectedNodes.length === 3,
                `expected 3 but instead got ${selectedNodes.length}`,
            );
            assert.ok(
                selectedNodes.includes(rootNode),
                'root node is included in nodes list sent to onContinue hook',
            );
            assert.ok(
                selectedNodes.includes(childNode),
                'child node is included in nodes list sent to onContinue hook',
            );
            assert.ok(
                selectedNodes.includes(grandChildNode),
                'grandchild node is included in nodes list sent to onContinue hook',
            );
        });
        await render(hbs`
            <Registries::PartialRegistrationModal::Manager
                @rootNode={{this.rootNode}}
                as |partialRegistrationManager|
            >
                <Registries::PartialRegistrationModal
                    @manager={{partialRegistrationManager}}
                    @onContinue={{action this.onContinue}}
                    @isOpen={{this.isOpen}}
                />
            </Registries::PartialRegistrationModal::Manager>
        `);
        this.set('isOpen', true);
        await settled();

        assert.dom(`[data-test-item="${root.id}"]`).exists();
        assert.dom(`[data-test-item="${child.id}"]`).exists();
        assert.dom(`[data-test-item="${grandChild.id}"]`).exists();
        assert.dom(`[data-test-item="${root.id}"] input`).isChecked();
        await click('[data-test-continue-registration-button]');
        this.set('isOpen', false);
        await settled();
    });

    test('select child selects parent; deselect parent deselects children', async function(assert) {
        assert.expect(10);
        this.store = this.owner.lookup('service:store');
        const root = server.create('node');
        const child = server.create('node', { parent: root });
        const grandChild = server.create('node', { parent: child });

        const rootNode = await this.store.findRecord('node', root.id);
        const childNode = await this.store.findRecord('node', child.id);
        const grandChildNode = await this.store.findRecord('node', grandChild.id);
        this.set('rootNode', rootNode);
        this.set('isOpen', false);
        this.set('onContinue', (selectedNodes: NodeModel[]) => {
            assert.ok(
                selectedNodes.length === 3,
                `expected 3 but instead got ${selectedNodes.length}`,
            );
            assert.ok(
                selectedNodes.includes(rootNode),
                'root node is included in nodes list sent to onContinue hook',
            );
            assert.ok(
                selectedNodes.includes(childNode),
                'child node is included in nodes list sent to onContinue hook',
            );
            assert.ok(
                selectedNodes.includes(grandChildNode),
                'grandchild node is included in nodes list sent to onContinue hook',
            );
        });
        await render(hbs`
            <Registries::PartialRegistrationModal::Manager
                @rootNode={{this.rootNode}}
                as |partialRegistrationManager|
            >
                <Registries::PartialRegistrationModal
                    @manager={{partialRegistrationManager}}
                    @onContinue={{action this.onContinue}}
                    @isOpen={{this.isOpen}}
                />
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
        await click('[data-test-continue-registration-button]');
        this.set('isOpen', false);
        await settled();
    });

    test('select all works, while clear all should not clear root node', async function(assert) {
        assert.expect(13);
        this.store = this.owner.lookup('service:store');
        const root = server.create('node');
        const child = server.create('node', { parent: root });
        const grandChild = server.create('node', { parent: child });

        const rootNode = await this.store.findRecord('node', root.id);
        const childNode = await this.store.findRecord('node', child.id);
        const grandChildNode = await this.store.findRecord('node', grandChild.id);
        this.set('rootNode', rootNode);
        this.set('isOpen', false);
        this.set('onContinue', (selectedNodes: NodeModel[]) => {
            assert.ok(
                selectedNodes.length === 3,
                `expected 3 but instead got ${selectedNodes.length}`,
            );
            assert.ok(
                selectedNodes.includes(rootNode),
                'root node is included in nodes list sent to onContinue hook',
            );
            assert.ok(
                selectedNodes.includes(childNode),
                'child node is included in nodes list sent to onContinue hook',
            );
            assert.ok(
                selectedNodes.includes(grandChildNode),
                'grandchild node is included in nodes list sent to onContinue hook',
            );
        });
        await render(hbs`
            <Registries::PartialRegistrationModal::Manager
                @rootNode={{this.rootNode}}
                as |partialRegistrationManager|
            >
                <Registries::PartialRegistrationModal
                    @manager={{partialRegistrationManager}}
                    @onContinue={{action this.onContinue}}
                    @isOpen={{this.isOpen}}
                />
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
        await click('[data-test-continue-registration-button]');
        this.set('isOpen', false);
        await settled();
    });

    test('selectedNodes captures deselect children', async function(assert) {
        assert.expect(8);
        this.store = this.owner.lookup('service:store');
        const root = server.create('node');
        const child = server.create('node', { parent: root });
        const grandChild = server.create('node', { parent: child });

        const rootNode = await this.store.findRecord('node', root.id);
        const childNode = await this.store.findRecord('node', child.id);
        const grandChildNode = await this.store.findRecord('node', grandChild.id);
        this.set('rootNode', rootNode);
        this.set('isOpen', false);
        this.set('onContinue', (selectedNodes: NodeModel[]) => {
            assert.ok(
                selectedNodes.length === 1,
                `expected 1 but instead got ${selectedNodes.length}`,
            );
            assert.ok(
                selectedNodes.includes(rootNode),
                'root node should be included in nodes list sent to onContinue hook',
            );
            assert.notOk(
                selectedNodes.includes(childNode),
                'child node should not be included in nodes list sent to onContinue hook',
            );
            assert.notOk(
                selectedNodes.includes(grandChildNode),
                'grandchild node should not be included in nodes list sent to onContinue hook',
            );
        });
        await render(hbs`
            <Registries::PartialRegistrationModal::Manager
                @rootNode={{this.rootNode}}
                as |partialRegistrationManager|
            >
                <Registries::PartialRegistrationModal
                    @manager={{partialRegistrationManager}}
                    @onContinue={{action this.onContinue}}
                    @isOpen={{this.isOpen}}
                />
            </Registries::PartialRegistrationModal::Manager>
        `);
        this.set('isOpen', true);
        await settled();
        assert.dom(`[data-test-item="${grandChild.id}"] input`).isChecked();
        assert.dom(`[data-test-item="${child.id}"] input`).isChecked();
        await click(`[data-test-item="${child.id}"] input`);
        assert.dom(`[data-test-item="${grandChild.id}"] input`).isNotChecked();
        assert.dom(`[data-test-item="${child.id}"] input`).isNotChecked();
        await click('[data-test-continue-registration-button]');
        this.set('isOpen', false);
        await settled();
    });
});
