import EmberObject from '@ember/object';
import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import I18N from 'ember-i18n/services/i18n';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

const i18nStub = Service.extend({
    translations: EmberObject.create({
        general: {
            ellipsis: '...',
        },
    }),

    t(key: string): string {
        // @ts-ignore
        return this.get('translations').get(key);
    },
});

interface ThisTestContext extends TestContext {
    i18n: I18N;
}

module('Integration | Component | ancestry-display', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ThisTestContext) {
        this.owner.register('service:i18n', i18nStub);
        this.i18n = this.owner.lookup('service:i18n');
        this.store = this.owner.lookup('service:store');
    });

    test('it renders', async function(assert) {
        await render(hbs`{{ancestry-display}}`);
        assert.dom(this.element).hasText('');

        const node = server.create('node');
        const root = await this.store.findRecord('node', node.id);
        this.set('node', root);

        await render(hbs`{{ancestry-display node=this.node}}`);
        assert.dom(this.element).hasText(`${node.title}`);
    });

    test('useLinks works', async function(assert) {
        const parent = server.create('node');
        const child = server.create('node', { parent });

        const childNode = await this.store.findRecord('node', child.id);
        this.set('node', childNode);

        await render(hbs`{{ancestry-display node=this.node}}`);
        assert.dom(this.element).hasText(`${parent.title} / ${childNode.title}`);
        assert.dom('[data-test-ancestor-title="0"]').doesNotExist();

        await render(hbs`{{ancestry-display node=this.node useLinks=true}}`);

        assert.dom(this.element).hasText(`${parent.title} / ${childNode.title}`);
        assert.dom('[data-test-ancestor-title="0"]').hasAttribute('href', `/${parent.id}`);
    });

    test('delimiter works', async function(assert) {
        const parent = server.create('node');
        const child = server.create('node', { parent });

        const childNode = await this.store.findRecord('node', child.id);
        const expected = `${parent.title} > ${childNode.title}`;

        this.set('node', childNode);
        this.set('delimiter', '>');

        await render(hbs`{{ancestry-display node=this.node delimiter=this.delimiter}}`);
        assert.dom(this.element).hasText(expected);
    });

    test('two ancestors', async function(assert) {
        const parent = server.create('node');
        const child = server.create('node', { parent, title: 'Baker' });
        const grandChild = server.create('node', { parent: child, root: parent, title: 'Ma Baker' });
        const expected = `${parent.title} / ${child.title} / ${grandChild.title}`;

        const grandChildNode = await this.store.findRecord('node', grandChild.id);
        this.set('node', grandChildNode);
        await render(hbs`{{ancestry-display node=this.node}}`);
        assert.dom(this.element).hasText(expected);
    });

    test('three ancestors', async function(assert) {
        const parent = server.create('node');
        const child = server.create('node', { parent, title: 'Baker' });
        const grandChild = server.create('node', { parent: child, root: parent, title: 'Ma Baker' });
        const greatGrandChild = server.create('node', { parent: grandChild, root: parent, title: 'Ma Baker Jr.' });
        const expected = `${parent.title} / ${this.get('i18n').t('general.ellipsis')} /\
            ${grandChild.title} / ${greatGrandChild.title}`;

        const greatGrandChildNode = await this.store.findRecord('node', greatGrandChild.id);
        this.set('node', greatGrandChildNode);
        await render(hbs`{{ancestry-display node=this.node}}`);
        assert.dom(this.element).hasText(expected);
    });
});
