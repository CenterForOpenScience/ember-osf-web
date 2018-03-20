import EmberObject from '@ember/object';
import WaffleRouteMixin from 'ember-osf-web/mixins/waffle-route';
import { module, test } from 'qunit';

module('Unit | Mixin | waffle-route', () => {
    // Replace this with your real tests.
    test('it works', assert => {
        const WaffleRouteObject = EmberObject.extend(WaffleRouteMixin);
        const subject = WaffleRouteObject.create();
        assert.ok(subject);
    });
});
