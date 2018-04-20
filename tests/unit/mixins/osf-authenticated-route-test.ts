import Ember from 'ember';
import OsfAuthenticatedRouteMixin from 'ember-osf-web/mixins/osf-authenticated-route';
import { module, test } from 'qunit';

module('Unit | Mixin | osf agnostic auth route');

// Replace this with your real tests.
test('it works', assert => {
    const OsfAuthenticatedRouteObject = Ember.Object.extend(OsfAuthenticatedRouteMixin);
    const subject = OsfAuthenticatedRouteObject.create();
    assert.ok(subject);
});
