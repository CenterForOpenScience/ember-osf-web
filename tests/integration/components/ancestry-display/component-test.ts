import EmberObject from '@ember/object';
import Service from '@ember/service';
import { render } from '@ember/test-helpers';

import { ModelInstance } from 'ember-cli-mirage';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import I18N from 'ember-i18n/services/i18n';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import RegistrationModel from 'ember-osf-web/models/registration';

const i18nStub = Service.extend({
    translations: EmberObject.create({
        general: {
            ellipsis: '\u2026',
        },
    }),

    t(key: string): string {
        // @ts-ignore
        return this.get('translations').get(key);
    },
});

interface ThisTestContext extends TestContext {
    i18n: I18N;
    root: ModelInstance<RegistrationModel>;
}

module('Integration | Component | ancestry-display', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ThisTestContext) {
        this.owner.register('service:i18n', i18nStub);
        this.i18n = this.owner.lookup('service:i18n');
        this.store = this.owner.lookup('service:store');
        const root = server.create('registration', {
            id: 'decaf',
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            title: 'Preregistration is designed to make clear the distinction between confirmatory tests, specified prior to seeing the data',
            root: null,
            currentUserPermissions: ['admin'],
        });
        this.set('root', root);
    });

    test('it renders', async function(this: ThisTestContext, assert) {
        await render(hbs`<AncestryDisplay @node={{this.root}} />`);
        assert.dom(this.element).hasText(`${this.root.title}`);
    });

    // test('useLinks works', async function(assert) {
    //     const parent = server.create('registration');
    //     const child = server.create('node', { parent });
    //
    //     const childNode = await this.store.findRecord('node', child.id);
    //     this.set('node', childNode);
    //
    //     await render(hbs`{{ancestry-display node=this.node}}`);
    //     assert.dom(this.element).hasText(`${parent.title} / ${childNode.title}`);
    //     assert.dom('[data-test-ancestor-title="0"]').doesNotExist();
    //
    //     await render(hbs`{{ancestry-display node=this.node useLinks=true}}`);
    //
    //     assert.dom(this.element).hasText(`${parent.title} / ${childNode.title}`);
    //     assert.dom('[data-test-ancestor-title="0"]').hasAttribute('href', `/${parent.id}`);
    // });
    //
    // test('delimiter works', async function(assert) {
    //     const parent = server.create('registration');
    //     const child = server.create('node', { parent });
    //
    //     const childNode = await this.store.findRecord('node', child.id);
    //     const expected = `${parent.title} > ${childNode.title}`;
    //
    //     this.set('node', childNode);
    //     this.set('delimiter', '>');
    //
    //     await render(hbs`{{ancestry-display node=this.node delimiter=this.delimiter}}`);
    //     assert.dom(this.element).hasText(expected);
    // });
    //
    // test('two ancestors', async function(assert) {
    //     const parent = server.create('registration');
    //     const child = server.create('node', { parent, title: 'Baker' });
    //     const grandChild = server.create('node', { parent: child, root: parent, title: 'Ma Baker' });
    //     const expected = `${parent.title} / ${child.title} / ${grandChild.title}`;
    //
    //     const grandChildNode = await this.store.findRecord('node', grandChild.id);
    //     this.set('node', grandChildNode);
    //     await render(hbs`{{ancestry-display node=this.node}}`);
    //     assert.dom(this.element).hasText(expected);
    // });
    //
    // test('three ancestors', async function(assert) {
    //     const parent = server.create('registration');
    //     const child = server.create('node', { parent, title: 'Baker' });
    //     const grandChild = server.create('node', { parent: child, root: parent, title: 'Ma Baker' });
    //     const greatGrandChild = server.create('node', { parent: grandChild, root: parent, title: 'Ma Baker Jr.' });
    //     const expected = `${parent.title} / ${this.get('i18n').t('general.ellipsis')} /\
    //         ${grandChild.title} / ${greatGrandChild.title}`;
    //
    //     const greatGrandChildNode = await this.store.findRecord('node', greatGrandChild.id);
    //     this.set('node', greatGrandChildNode);
    //     await render(hbs`{{ancestry-display node=this.node}}`);
    //     assert.dom(this.element).hasText(expected);
    // });
});
