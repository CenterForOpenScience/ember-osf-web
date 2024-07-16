import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { validateHttpUrl } from 'ember-osf-web/validators/url-field';

module('Unit | Validator | url-field', function(hooks) {
    setupTest(hooks);

    test('it works', function(assert) {
        const baseValidator = validateHttpUrl();
        assert.ok(baseValidator('http://a.com'), 'http is valid');
        assert.ok(baseValidator('https://b.com'), 'https is valid');
        assert.strictEqual(baseValidator('c.com').type, 'url', 'no protocol is invalid');
        assert.strictEqual(baseValidator('http://d').type, 'url', 'no domain is invalid');
        assert.strictEqual(baseValidator('ftp://e.com').type, 'url', 'ftp is invalid');

        const customValidator = validateHttpUrl({ acceptedProtocols: ['http'] });
        assert.ok(customValidator('http://a.com'), 'http is valid');
        assert.strictEqual(customValidator('https://b.com').type, 'url', 'https is invalid');
        assert.strictEqual(customValidator('c.com').type, 'url', 'no protocol is invalid');
        assert.strictEqual(customValidator('http://d', { type: 'url' }), 'no domain is invalid');
        assert.strictEqual(customValidator('ftp://e.com').type, 'url', 'ftp is invalid');
    });
});
