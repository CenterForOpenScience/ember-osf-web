import Ember from 'ember';
import FileItemMixin from 'ember-osf-web/mixins/file-item';
import { module, test } from 'qunit';

module('Unit | Mixin | file item');

// Replace this with your real tests.
test('it works', function(assert) {
    const FileItemObject = Ember.Object.extend(FileItemMixin);
    const subject = FileItemObject.create();
    assert.ok(subject);
});
