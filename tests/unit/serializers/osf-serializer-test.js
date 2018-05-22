import { module, test } from 'qunit';
import { setupTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import faker from 'faker';

module('serializer:osf-serializer', function(hooks) {
    setupTest(hooks);

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
        const serializer = this.owner.lookup('serializer:osf-serializer');
        const normalized = serializer._mergeLinks(payload);
        assert.propEqual(normalized.attributes.links, payload.links);
    });
});
