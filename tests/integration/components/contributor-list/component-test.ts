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
        list: {
            two_item: {
                delimiter: ' and ',
            },
            many_item: {
                first_delimiter: ', ',
                each_delimiter: ', ',
                last_delimiter: ', and ',
            },
        },
    }),

    t(key: string, options: any): string {
        if (key === 'contributor_list.and_x_more') {
            return `${options.get('x')} more`;
        }
        // @ts-ignore
        return this.get('translations').get(key);
    },
});

interface ThisTestContext extends TestContext {
    i18n: I18N;
}

module('Integration | Component | contributor-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ThisTestContext) {
        this.owner.register('service:i18n', i18nStub);
        this.i18n = this.owner.lookup('service:i18n');
        this.store = this.owner.lookup('service:store');
    });

    test('showNonBibliographic works', async function(assert) {
        const node = server.create('node');
        const users = server.createList('user', 3);

        server.create('contributor', { node, users: users[0], bibliographic: true });
        server.create('contributor', { node, users: users[1], bibliographic: true });
        server.create('contributor', { node, users: users[2], bibliographic: false });

        const nodeWithContribs = await this.store.findRecord('node', node.id, { include: 'contributors' });
        this.set('node', nodeWithContribs);

        await render(hbs`{{contributor-list node=this.node showNonBibliographic=false}}`);
        assert.dom(this.element).hasText(`${users[0].familyName} and ${users[1].familyName}`);

        await render(hbs`{{contributor-list node=this.node showNonBibliographic=true}}`);
        assert.dom(this.element).hasText(`${users[0].familyName}, ${users[1].familyName}, and ${users[2].familyName}`);
    });

    test('useContributorLink links contributor names', async function(assert) {
        const node = server.create('node');
        const users = server.createList('user', 4);
        for (const user of users) {
            server.create('contributor', { node, users: user, bibliographic: true });
        }
        const nodeWithContribs = await this.store.findRecord('node', node.id, { include: 'contributors' });
        this.set('node', nodeWithContribs);

        this.set('node', nodeWithContribs);
        await render(hbs`{{contributor-list node=this.node useContributorLink=true useShowMoreLink=true}}`);

        assert.dom('[data-test-contributor-title]').exists({ count: 3 });
        assert.dom('[data-test-contributor-title]:first-child').hasAttribute('href', `/${users[0].id}`);
        assert.dom('[data-test-load-more-contribs]').hasText('1 more');
    });

    test('it renders', async function(assert) {
        const node = server.create('node');
        const users = server.createList('user', 4);

        let nodeWithContribs = await this.store.findRecord('node', node.id, { include: 'contributors' });
        this.set('node', nodeWithContribs);
        await render(hbs`{{contributor-list node=this.node useContributorLink=true useShowMoreLink=true}}`);
        assert.dom(this.element).hasText('');

        server.create('contributor', { node, users: users[0], bibliographic: true });
        nodeWithContribs = await this.store.findRecord('node', node.id, { include: 'contributors' });
        this.set('node', nodeWithContribs);
        await render(hbs`{{contributor-list node=this.node useContributorLink=true useShowMoreLink=true}}`);
        assert.dom(this.element).hasText(users[0].familyName);

        server.create('contributor', { node, users: users[1], bibliographic: true });
        nodeWithContribs = await this.store.findRecord('node', node.id, { include: 'contributors' });
        this.set('node', nodeWithContribs);
        await render(hbs`{{contributor-list node=this.node useContributorLink=true useShowMoreLink=true}}`);
        assert.dom(this.element).hasText(`${users[0].familyName} and ${users[1].familyName}`);

        server.create('contributor', { node, users: users[2], bibliographic: true });
        nodeWithContribs = await this.store.findRecord('node', node.id, { include: 'contributors' });
        this.set('node', nodeWithContribs);
        await render(hbs`{{contributor-list node=this.node useContributorLink=true useShowMoreLink=true}}`);
        assert.dom(this.element).hasText(`\
            ${users[0].familyName}, ${users[1].familyName}, and ${users[2].familyName}`);

        server.create('contributor', { node, users: users[2], bibliographic: true });
        nodeWithContribs = await this.store.findRecord('node', node.id, { include: 'contributors' });
        this.set('node', nodeWithContribs);
        await render(hbs`{{contributor-list node=this.node useContributorLink=true useShowMoreLink=true}}`);
        assert.dom(this.element).hasText(`\
            ${users[0].familyName}, ${users[1].familyName}, ${users[2].familyName}, and 1 more`);
    });
});
