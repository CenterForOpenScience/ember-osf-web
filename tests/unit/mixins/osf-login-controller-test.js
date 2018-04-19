import EmberObject from '@ember/object';
import OsfTokenLoginControllerMixin from 'ember-osf-web/mixins/osf-token-login-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | osf token login controller');

// Replace this with your real tests.
test('it works', function(assert) {
    const OsfLoginControllerObject = EmberObject.extend(OsfTokenLoginControllerMixin);
    const subject = OsfLoginControllerObject.create();
    assert.ok(subject);
});
