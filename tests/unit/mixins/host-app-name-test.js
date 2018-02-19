import Ember from 'ember';
import { module, test } from 'qunit';

module('Unit | Mixin | host app name');

test('host-app-name mixin holds the hosting application name', function(assert) {
    const hostAppName_ = Ember.Mixin.create({ newAppName: 'Dummy App' });
    const objectA = Ember.Component.extend(hostAppName_);
    const componentA = objectA.create({ renderer: {} });
    assert.equal(hostAppName_.detect(componentA), true);
    assert.equal(componentA.get('hostAppName'), 'Dummy App');
});
