import Ember from 'ember';
import OsfAgnosticAuthRouteMixin from 'ember-osf-web/mixins/osf-agnostic-auth-route';
import { module, test } from 'qunit';

module('Unit | Mixin | osf agnostic auth route');

// Replace this with your real tests.
test('it works', function(assert) {
    const OsfAgnosticAuthRouteObject = Ember.Object.extend(OsfAgnosticAuthRouteMixin);
    const subject = OsfAgnosticAuthRouteObject.create();
    assert.ok(subject);
});
