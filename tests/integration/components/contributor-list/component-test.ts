import { A } from '@ember/array';
import EmberObject from '@ember/object';
import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import I18N from 'ember-i18n/services/i18n';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
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

    hooks.beforeEach(function(this: ThisTestContext) {
        this.owner.register('service:i18n', i18nStub);
        this.i18n = this.owner.lookup('service:i18n');
    });

    function nameToUsersFamilyNames(familyName: string): EmberObject {
        return EmberObject.create({
            users: EmberObject.create({
                familyName,
            }),
        });
    }

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

        // eslint-disable-next-line no-await-in-loop
        for (const [input, expected] of testCases) {
            const contributors = {
                toArray: () => A(input.map(nameToUsersFamilyNames)),
                meta: {
                    total: input.length,
                },
            };
            this.set('contributors', contributors);
            await render(hbs`{{contributor-list contributors=contributors}}`);
            assert.hasText(this.element, expected);
        }
    });
});
