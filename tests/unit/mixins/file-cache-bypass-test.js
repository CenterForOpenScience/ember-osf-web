import Ember from 'ember';
import FileCacheBypassMixin from 'ember-osf-web/mixins/file-cache-bypass';
import { module, test } from 'qunit';

module('Unit | Mixin | file cache bypass');

// Replace this with your real tests.
test('it works', function(assert) {
    const FileCacheBypassObject = Ember.Object.extend(FileCacheBypassMixin);
    const subject = FileCacheBypassObject.create();
    assert.ok(subject);
});
