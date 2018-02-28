import { moduleFor, test } from 'ember-qunit';
import faker from 'faker';

moduleFor('serializer:osf-serializer');

test('#_mergeFields adds links to attributes if included in payload', function (assert) {
    const payload = {
        id: faker.random.uuid(),
        type: 'base',
        attributes: {
            key: 'value',
        },
        links: {
            html: faker.internet.url(),
        },
    };
    const serializer = this.container.lookup('serializer:osf-serializer');
    const normalized = serializer._mergeFields(payload);
    assert.equal(normalized.attributes.links, payload.links);
});
/* TODO fixme
test('#_mergeFields adds embeds to attributes if included in payload', function(assert) {
    let payload = {
        id: faker.random.uuid(),
        attributes: {
            key: 'value'
        },
        embeds: {
            embedded: {
                data: [faker.random.arrayElement()]
            }
        }
    };
    let serializer = this.container.lookup('serializer:osf-serializer');
    let normalized = serializer._mergeFields(payload);

    assert.equal(normalized.attributes.embeds, payload.embeds);
});
*/
