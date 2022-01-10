import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { HierarchicalListManager } from 'osf-components/components/registries/hierarchical-list';
import { module, test } from 'qunit';

module('Integration | Component | hierarchical-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('clicks on checkboxes trigger onChange', async function(assert) {
        assert.expect(7);
        this.store = this.owner.lookup('service:store');
        const root = server.create('node');
        const child = server.create('node', { parent: root });
        const grandChild = server.create('node', { parent: child });

        const rootNode = await this.store.findRecord('node', root.id);
        const childNode = await this.store.findRecord('node', child.id);
        const grandChildNode = await this.store.findRecord('node', grandChild.id);
        this.set('rootNode', rootNode);
        rootNode.set('children', [childNode]);
        childNode.set('children', [grandChildNode]);
        const listManager: HierarchicalListManager = {
            nodesIncludingRoot: [],
            selectedNodes: [],
            isChecked() {
                return false;
            },
            onChange() {
                assert.ok(1);
            },
        };
        this.set('listManager', listManager);
        await render(hbs`
            <Registries::HierarchicalList::ItemManager
                @item={{this.rootNode}}
                @listManager={{this.listManager}}
                as |itemManager|
            >
                <Registries::HierarchicalList::Item @manager={{itemManager}} />
            </Registries::HierarchicalList::ItemManager>
        `);

        // Check and see if onChange hook is invoked; each should trigger one assert in the listManager stub
        await click(`[data-test-item="${root.id}"] input`);
        await click(`[data-test-item="${child.id}"] input`);
        await click(`[data-test-item="${grandChild.id}"] input`);

        // Check and see if the expand/collapse functionality works;
        await click(`[data-test-expand-child="${root.id}"]`);
        assert.dom(`[data-test-item="${child.id}"]`).doesNotExist();
        assert.dom(`[data-test-item="${grandChild.id}"]`).doesNotExist();
        await click(`[data-test-expand-child="${root.id}"]`);
        assert.dom(`[data-test-item="${child.id}"]`).exists();
        assert.dom(`[data-test-item="${grandChild.id}"]`).exists();
    });
});
