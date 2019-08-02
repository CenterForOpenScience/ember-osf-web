import { click, render, settled } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { clickTrigger, typeInSearch } from 'ember-power-select/test-support/helpers';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

function expectedCitation(node: { title: string }, citationStyle: ModelInstance) {
    return `Pretend citation for "${node.title}" in the style "${citationStyle.title}"`;
}

module('Integration | Component | citation-viewer', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('default citations', async function(assert) {
        server.loadFixtures('citation-styles');
        const mirageReg = server.create('registration');
        const reg = await this.store.findRecord('registration', mirageReg.id);
        this.set('node', reg);

        await render(hbs`<CitationViewer @citable={{this.node}} />`);
        await settled();

        for (const citationStyle of ['apa', 'modern-language-association', 'chicago-author-date']) {
            assert.dom(`[data-test-default-citation="${citationStyle}"] input`).hasValue(
                expectedCitation(reg, server.schema.citationStyles.find(citationStyle)),
            );
        }
    });

    test('search citations', async function(assert) {
        server.loadFixtures('citation-styles');

        const mirageCitationStyle = server.create('citation-style');
        const mirageReg = server.create('registration');
        const reg = await this.store.findRecord('registration', mirageReg.id);
        this.set('node', reg);

        await render(hbs`<CitationViewer @citable={{this.node}} />`);

        await clickTrigger();
        await typeInSearch(mirageCitationStyle.title!);

        assert.dom('[data-test-citation-search-result]').exists({ count: 1 });

        await click('[data-test-citation-search-result]');

        assert.dom('[data-test-selected-citation] input').hasValue(
            expectedCitation(reg, mirageCitationStyle),
        );
    });
});
