import EmberObject from '@ember/object';
import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

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

    t(key: string): string {
        // @ts-ignore
        return this.get('translations').get(key);
    },
});

module('Integration | Component | inline-list', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:i18n', i18nStub);
    });

    test('it renders without truncate', async function(assert) {
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
                'Doe, Smith, Johnson, and Green',
            ],
            [
                ['Doe', 'Smith', 'Johnson', 'Green', 'Thompson'],
                'Doe, Smith, Johnson, Green, and Thompson',
            ],
        ];

        // eslint-disable-next-line no-await-in-loop
        for (const [input, expected] of testCases) {
            this.set('list', input);
            await render(hbs`
                {{#inline-list items=list as | l |}}
                    {{~l.item~}}
                {{/inline-list}}
            `);
            assert.hasText(this.element, expected);
        }
    });
    test('it renders with truncate', async function(assert) {
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
                'Doe, Smith, Johnson, and more',
            ],
        ];

        // eslint-disable-next-line no-await-in-loop
        for (const [input, expected] of testCases) {
            this.set('list', input);
            await render(hbs`
                {{#inline-list items=list truncate=3 as | l |}}
                    {{#if l.truncate~}}
                        <span>more</span>
                    {{else}}
                        {{~l.item~}}
                    {{/if}}
                {{/inline-list}}
            `);
            assert.hasText(this.element, expected);
        }
    });
});
