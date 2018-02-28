import Ember from 'ember';
import OsfTokenLoginRouteMixin from 'ember-osf-web/mixins/osf-token-login-route';
import { module, test } from 'qunit';

module('Unit | Mixin | osf token login route');

// Replace this with your real tests.
test('it works', function(assert) {
    const OsfLoginRouteObject = Ember.Object.extend(OsfTokenLoginRouteMixin);
    const subject = OsfLoginRouteObject.create();
    assert.ok(subject);
});
