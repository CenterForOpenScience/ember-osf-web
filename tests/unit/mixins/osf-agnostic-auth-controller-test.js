import Ember from 'ember';
import OsfAgnosticAuthControllerMixin from 'ember-osf-web/mixins/osf-agnostic-auth-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | osf agnostic auth controller');

// Replace this with your real tests.
test('it works', function(assert) {
    const OsfAgnosticAuthControllerObject = Ember.Object.extend(OsfAgnosticAuthControllerMixin);
    const subject = OsfAgnosticAuthControllerObject.create();
    assert.ok(subject);
});
