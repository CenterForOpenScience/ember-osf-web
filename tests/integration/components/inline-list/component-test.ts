import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inline-list', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks, {
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

        for (const [input, expected] of testCases) {
            this.set('list', input);
            await render(hbs`
                {{#inline-list items=list as | l |}}
                    {{~l.item~}}
                {{/inline-list}}
            `);
            assert.dom(this.element).hasText(expected);
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
                'Doe, Smith, Johnson, and 1 more',
            ],
        ];

        for (const [input, expected] of testCases) {
            this.set('list', input);
            await render(hbs`
                {{#inline-list items=list truncate=3 as | l |}}
                    {{#if l.remainingCount~}}
                        <span>{{l.remainingCount}} more</span>
                    {{else}}
                        {{~l.item~}}
                    {{/if}}
                {{/inline-list}}
            `);
            assert.dom(this.element).hasText(expected);
        }
    });
});
