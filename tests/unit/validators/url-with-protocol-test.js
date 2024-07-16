import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { validateUrlWithProtocols } from 'ember-osf-web/validators/url-with-protocol';

module('Unit | Validator | url-with-protocol', function(hooks) {
    setupTest(hooks);

    test('it works', function(assert) {
        const baseValidator = validateUrlWithProtocols();
        assert.ok(baseValidator('http://a.com'), 'http is valid');
        assert.ok(baseValidator('https://b.com'), 'https is valid');
        assert.strictEqual(baseValidator('c.com').type, 'url', 'no protocol is invalid');
        assert.strictEqual(baseValidator('http://d').type, 'url', 'no domain is invalid');
        assert.strictEqual(baseValidator('ftp://e.com').type, 'url', 'ftp is invalid');

        const customValidator = validateUrlWithProtocols({ acceptedProtocols: ['http'] });
        assert.ok(customValidator('http://a.com'), 'http is valid');
        assert.strictEqual(customValidator('https://b.com').type, 'url', 'https is invalid');
        assert.strictEqual(customValidator('c.com').type, 'url', 'no protocol is invalid');
        assert.strictEqual(customValidator('http://d').type, 'url', 'no domain is invalid');
        assert.strictEqual(customValidator('ftp://e.com').type, 'url', 'ftp is invalid');
    });
});
