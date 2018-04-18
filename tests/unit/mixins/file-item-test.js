import EmberObject from '@ember/object';
import FileItemMixin from 'ember-osf-web/mixins/file-item';
import { module, test } from 'qunit';

module('Unit | Mixin | file item');

// Replace this with your real tests.
test('it works', function(assert) {
    const FileItemObject = EmberObject.extend(FileItemMixin);
    const subject = FileItemObject.create();
    assert.ok(subject);
});
