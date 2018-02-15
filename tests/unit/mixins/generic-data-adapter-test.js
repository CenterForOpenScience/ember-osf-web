import Ember from 'ember';
import GenericDataAdapterMixin from 'ember-osf-web/mixins/generic-data-adapter';
import { module, test } from 'qunit';

module('Unit | Mixin | generic data adapter');

// Replace this with your real tests.
test('it works', function(assert) {
    const GenericDataAdapterObject = Ember.Object.extend(GenericDataAdapterMixin);
    const subject = GenericDataAdapterObject.create();
    assert.ok(subject);
});
