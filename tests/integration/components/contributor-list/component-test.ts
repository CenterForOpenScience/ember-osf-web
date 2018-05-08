import { A } from '@ember/array';
import EmberObject from '@ember/object';
import Service from '@ember/service';
import { moduleForComponent, test } from 'ember-qunit';
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

    t(key: string, options: any): string {
        if (key === 'contributor_list.and_x_more') {
            return `${options.get('x')} more`;
        }
        // @ts-ignore
        return this.get('translations').get(key);
    },
});

moduleForComponent('contributor-list', 'Integration | Component | contributor list', {
    integration: true,

    beforeEach() {
        this.register('service:i18n', i18nStub);
        this.inject.service('i18n', { as: 'i18n' });
    },
});

function nameToUsersFamilyNames(familyName: string): EmberObject {
    return EmberObject.create({
        users: EmberObject.create({
            familyName,
        }),
    });
}

test('it renders', function(assert) {
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

    for (const [input, expected] of testCases) {
        const contributors = {
            toArray: () => A(input.map(nameToUsersFamilyNames)),
            meta: {
                total: input.length,
            },
        };
        this.set('contributors', contributors);
        this.render(hbs`{{contributor-list contributors=contributors}}`);
        assert.equal(this.$().text().trim(), expected);
    }
});
