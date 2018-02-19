import Ember from 'ember';
import hostAppName from 'ember-osf-web/mixins/host-app-name';
import { module, test } from 'qunit';

module('Unit | Mixin | host app name');

test('host-app-name mixin holds the hosting application name', function(assert) {
    const objectA = Ember.Component.extend(hostAppName);
    const componentA = objectA.create({ renderer: {} });
    assert.ok(componentA);
    assert.equal(hostAppName.detect(componentA), true);
});
