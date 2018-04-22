import EmberObject from '@ember/object';
import GenericDataAdapterMixin from 'ember-osf-web/mixins/generic-data-adapter';
import { module, test } from 'qunit';

module('Unit | Mixin | generic data adapter');

// Replace this with your real tests.
test('it works', assert => {
    const GenericDataAdapterObject = EmberObject.extend(GenericDataAdapterMixin);
    const subject = GenericDataAdapterObject.create();
    assert.ok(subject);
});
