import EmberObject from '@ember/object';
import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import I18N from 'ember-i18n/services/i18n';

import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import CurrentUser from 'ember-osf-web/services/current-user';
import { click } from 'ember-osf-web/tests/helpers';

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
        if (key === 'contributor_list.x_more') {
            return `${options.get('x')} more`;
        }
        // @ts-ignore
        return this.get('translations').get(key);
    },
});

interface ThisTestContext extends TestContext {
    i18n: I18N;
    currentUser: CurrentUser;
}

module('Integration | Component | contributor-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ThisTestContext) {
        this.owner.register('service:i18n', i18nStub);
        this.i18n = this.owner.lookup('service:i18n');
        this.store = this.owner.lookup('service:store');
        this.currentUser = this.owner.lookup('service:current-user');
    });

    test('shouldLinkUsers links contributor names', async function(assert) {
        const node = server.create('node');
        const users = server.createList('user', 4);
        for (const user of users) {
            server.create('contributor', { node, users: user }, 'registered');
        }
        const nodeWithContribs = await this.store.findRecord('node', node.id);
        this.set('node', nodeWithContribs);

        await render(hbs`<ContributorList @node={{this.node}} @shouldLinkUsers={{true}} />`);

        assert.dom('a[data-test-contributor-name]').exists({ count: 3 });
        for (const user of users.slice(0, 3)) {
            assert.dom(`a[data-test-contributor-name][href="/${user.id}"]`).exists();
        }
    });

    test('it renders', async function(assert) {
        const node = server.create('node');
        const users = server.createList('user', 4);

        const reloadNode = () => this.store.findRecord('node', node.id, {
            include: 'bibliographic_contributors',
            reload: true,
        });

        // non-bibliographic contribs should not show
        server.create('contributor', { node, bibliographic: false });

        this.set('node', await reloadNode());
        await render(hbs`<ContributorList @node={{this.node}} />`);
        assert.dom(this.element).hasText('');

        server.create('contributor', { node, users: users[0] });
        this.set('node', await reloadNode());
        await render(hbs`<ContributorList @node={{this.node}} />`);
        assert.dom(this.element).hasText(users[0].familyName);

        server.create('contributor', { node, users: users[1] });
        this.set('node', await reloadNode());
        await render(hbs`<ContributorList @node={{this.node}} />`);
        assert.dom(this.element).hasText(`${users[0].familyName} and ${users[1].familyName}`);

        server.create('contributor', { node, users: users[2] });
        this.set('node', await reloadNode());
        await render(hbs`<ContributorList @node={{this.node}} />`);
        assert.dom(this.element).hasText(
            `${users[0].familyName}, ${users[1].familyName}, and ${users[2].familyName}`,
        );

        server.create('contributor', { node, users: users[3] });
        this.set('node', await reloadNode());
        await render(hbs`<ContributorList @node={{this.node}} />`);
        assert.dom(this.element).hasText(
            `${users[0].familyName}, ${users[1].familyName}, ${users[2].familyName}, and 1 more`,
        );
    });

    test('it renders multiple pages', async function(assert) {
        const node = server.create('node');

        const biblioUsers = server.createList('user', 28);
        for (const user of biblioUsers) {
            server.create('contributor', { node, users: user });
        }

        const nonBiblioUsers = server.createList('user', 7);
        for (const user of nonBiblioUsers) {
            server.create('contributor', { node, users: user, bibliographic: false });
        }

        const nodeWithContribs = await this.store.findRecord('node', node.id);
        this.set('node', nodeWithContribs);

        await render(hbs`<ContributorList @node={{this.node}} @shouldTruncate={{false}} />`);

        assert.dom('[data-test-contributor-name]').exists({ count: 10 });
        await click('[data-test-load-more-contribs]');
        assert.dom('[data-test-contributor-name]').exists({ count: 20 });
        await click('[data-test-load-more-contribs]');
        assert.dom('[data-test-contributor-name]').exists({ count: 28 });
        assert.dom('[data-test-load-more-contribs]').doesNotExist();
    });

    test('it handles anonymized nodes', async function(this: ThisTestContext, assert) {
        const mirageNode = server.create('node');

        const biblioUsers = server.createList('user', 8);
        for (const user of biblioUsers) {
            server.create('contributor', { node: mirageNode, users: user });
        }

        this.currentUser.viewOnlyToken = 'hey look a VOL';
        const node = await this.store.findRecord('node', mirageNode.id);
        node.set('apiMeta', {
            version: '',
            anonymous: true,
        });
        this.setProperties({ node });

        await render(hbs`<ContributorList @node={{this.node}} @shouldTruncate={{false}} />`);

        assert.dom('[data-test-contributor-name]').doesNotExist();
        assert.dom('[data-test-load-more-contribs]').doesNotExist();
        assert.dom().hasText('Anonymous contributors');

        await render(hbs`<ContributorList @node={{this.node}} @shouldTruncate={{true}} />`);

        assert.dom('[data-test-contributor-name]').doesNotExist();
        assert.dom('[data-test-load-more-contribs]').doesNotExist();
        assert.dom().hasText('Anonymous contributors');
    });
});
