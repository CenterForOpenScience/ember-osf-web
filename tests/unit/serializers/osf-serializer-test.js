import { moduleFor, test } from 'ember-qunit';
import faker from 'faker';

moduleFor('serializer:osf-serializer');

test('#_mergeLinks adds links to attributes if included in payload', function (assert) {
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
    const normalized = serializer._mergeLinks(payload);
    assert.propEqual(normalized.attributes.links, payload.links);
});
