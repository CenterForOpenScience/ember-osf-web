import Ember from 'ember';
import OsfTokenLoginControllerMixin from 'ember-osf-web/mixins/osf-token-login-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | osf token login controller');

// Replace this with your real tests.
test('it works', function(assert) {
    const OsfLoginControllerObject = Ember.Object.extend(OsfTokenLoginControllerMixin);
    const subject = OsfLoginControllerObject.create();
    assert.ok(subject);
});
