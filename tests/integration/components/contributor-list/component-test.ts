import { A } from '@ember/array';
import EmberObject from '@ember/object';
import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import I18N from 'ember-i18n/services/i18n';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
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
    });

    function nameToUsersFamilyNames(
        this: { bibliographic?: boolean, id?: string },
        familyName: string,
    ): EmberObject {
        return EmberObject.create({
            users: EmberObject.create({
                familyName,
                id: this.id,
            }),
            bibliographic: this.bibliographic,
        });
    }

    test('showNonBibliographic works', async function(assert) {
        const nonBiblioUsers: string[] = ['Freddie', 'Jane', 'Doe'];
        const contributors = {
            toArray: () => A(nonBiblioUsers.map(nameToUsersFamilyNames, { bibliographic: false })),
            meta: {
                total: nonBiblioUsers.length,
            },
        };
        this.set('contributors', contributors);

        await render(hbs`{{contributor-list contributors=contributors showNonBibliographic=true}}`);
        assert.dom(this.element).hasText('Freddie, Jane, and Doe');

        await render(hbs`{{contributor-list contributors=contributors showNonBibliographic=false}}`);
        assert.dom(this.element).hasText('');
    });

    test('useLinks linkifies contributor names', async function(assert) {
        const users: string[] = ['Freddie', 'Jane', 'Doe', 'Moore'];
        const contributors = {
            toArray: () => A(users.map(nameToUsersFamilyNames, { bibliographic: true, id: 'ezcuk' })),
            meta: {
                total: users.length,
            },
        };

        this.set('contributors', contributors);
        await render(hbs`{{contributor-list contributors=contributors useLinks=true}}`);

        assert.dom('span.ember-view > a').exists({ count: 3 });
        assert.dom('span.ember-view > a:first-child').hasAttribute('href', '/ezcuk');
        assert.dom('span.ember-view > button').hasText('1 more');
    });

    test('flatten contributors list in Prerender', async function(assert) {
        const node = server.create('node', {});

        const users: string[] = ['Freddie', 'Jane', 'Doe', 'Moore', 'Ngabo', 'Seka'];
        const contributors = {
            toArray: () => A(users.map(nameToUsersFamilyNames, { bibliographic: true })),
            meta: {
                total: users.length,
            },
        };

        this.set('contributors', contributors);
        this.set('node', node);
        this.set('userIsBot', true);

        await render(hbs`{{contributor-list contributors=contributors node=node userIsBot=true}}`);

        assert.dom('span.ember-view > span').exists({ count: users.length });
    });

    test('it renders', async function(assert) {
        const testCases: Array<[string[], string]> = [
            [
                [],
                '',
            ],
            [
                ['Doe'],
                'Doe',
            ],
            [
                ['Doe', 'Smith'],
                'Doe and Smith',
            ],
            [
                ['Doe', 'Smith', 'Johnson'],
                'Doe, Smith, and Johnson',
            ],
            [
                ['Doe', 'Smith', 'Johnson', 'Green'],
                'Doe, Smith, Johnson, and 1 more',
            ],
            [
                ['Doe', 'Smith', 'Johnson', 'Green', 'Thompson'],
                'Doe, Smith, Johnson, and 2 more',
            ],
        ];

        assert.expect(testCases.length);

        for (const [input, expected] of testCases) {
            const contributors = {
                toArray: () => A(input.map(nameToUsersFamilyNames, { bibliographic: true })),
                meta: {
                    total: input.length,
                },
            };
            this.set('contributors', contributors);
            await render(hbs`{{contributor-list contributors=contributors}}`);
            assert.dom(this.element).hasText(expected);
        }
    });
});
