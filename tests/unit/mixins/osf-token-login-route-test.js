import EmberObject from '@ember/object';
import OsfTokenLoginRouteMixin from 'ember-osf-web/mixins/osf-token-login-route';
import { module, test } from 'qunit';

module('Unit | Mixin | osf token login route');

// Replace this with your real tests.
test('it works', function(assert) {
    const OsfLoginRouteObject = EmberObject.extend(OsfTokenLoginRouteMixin);
    const subject = OsfLoginRouteObject.create();
    assert.ok(subject);
});
