import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { OsfLinkRouterStub } from '../../helpers/osf-link-router-stub';

module('Integration | Component | ancestry-display', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks, {
        translations: {
            general: {
                ellipsis: '\u2026',
            },
        },
    });

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
        this.owner.register('service:router', OsfLinkRouterStub.extend({
            urlFor(__: any, modelId: string) {
                return `/${modelId}`;
            },
        }));
    });

    test('it renders', async function(assert) {
        const node = server.create('node');
        const root = await this.store.findRecord('node', node.id);
        this.set('node', root);

        await render(hbs`<AncestryDisplay @node={{this.node}} />`);
        assert.dom(this.element).hasText('');
    });

    test('useLinks works', async function(assert) {
        const parent = server.create('node');
        const child = server.create('node', { parent });

        const childNode = await this.store.findRecord('node', child.id);
        this.set('node', childNode);

        await render(hbs`<AncestryDisplay @node={{this.node}} />`);
        assert.dom(this.element).hasText(`${parent.title} /`);
        assert.dom('[data-test-ancestor-title="0"]').doesNotExist();

        await render(hbs`<AncestryDisplay @node={{this.node}} @useLinks={{true}} />`);

        assert.dom(this.element).hasText(`${parent.title} /`);
        assert.dom('[data-test-ancestor-title="0"]').hasAttribute('href', `/${parent.id}`);
    });

    test('delimiter works', async function(assert) {
        const parent = server.create('node');
        const child = server.create('node', { parent });
        const expected = `${parent.title} >`;

        const childNode = await this.store.findRecord('node', child.id);

        this.set('node', childNode);
        this.set('delimiter', '>');

        await render(hbs`<AncestryDisplay @node={{this.node}} @delimiter={{this.delimiter}} />`);
        assert.dom(this.element).hasText(expected);
    });

    test('two ancestors', async function(assert) {
        const parent = server.create('node');
        const child = server.create('node', { parent });
        const grandChild = server.create('node', { parent: child });
        const expected = `${parent.title} / ${child.title} /`;

        const grandChildNode = await this.store.findRecord('node', grandChild.id);
        this.set('node', grandChildNode);
        await render(hbs`<AncestryDisplay @node={{this.node}} @useLinks={{true}} />`);
        assert.dom(this.element).hasText(expected);
        assert.dom('[data-test-ancestor-title="0"]').hasAttribute('href', `/${parent.id}`);
        assert.dom('[data-test-ancestor-title="1"]').hasAttribute('href', `/${child.id}`);
    });

    test('three ancestors', async function(assert) {
        const parent = server.create('node');
        const child = server.create('node', { parent });
        const grandChild = server.create('node', { parent: child });
        const greatGrandChild = server.create('node', { parent: grandChild });
        const expected = `${parent.title} / ${this.get('intl').t('general.ellipsis')} /\
            ${grandChild.title} /`;

        const greatGrandChildNode = await this.store.findRecord('node', greatGrandChild.id);
        this.set('node', greatGrandChildNode);
        await render(hbs`<AncestryDisplay @node={{this.node}} @useLinks={{true}} />`);
        assert.dom('[data-test-ancestor-title="0"]').hasAttribute('href', `/${parent.id}`);
        assert.dom('[data-test-ancestor-title="1"]').doesNotExist();
        assert.dom('[data-test-ancestor-title="2"]').hasAttribute('href', `/${grandChild.id}`);
        assert.dom(this.element).hasText(expected);
    });
});
