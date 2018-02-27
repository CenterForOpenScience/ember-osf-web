import Ember from 'ember';
import OsfCookieLoginControllerMixin from 'ember-osf-web/mixins/osf-cookie-login-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | osf cookie login controller');

// Replace this with your real tests.
test('it works', function(assert) {
    const OsfCookieLoginControllerObject = Ember.Object.extend(OsfCookieLoginControllerMixin);
    const subject = OsfCookieLoginControllerObject.create();
    assert.ok(subject);
});
