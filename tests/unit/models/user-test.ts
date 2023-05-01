import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | user', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('user'));
        assert.ok(!!model);
    });

    test('it has appropriate attributes', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('user'));
        assert.ok('fullName' in model);
        assert.ok('givenName' in model);
        assert.ok('middleNames' in model);
        assert.ok('familyName' in model);
        assert.ok('dateRegistered' in model);
        assert.ok('fullName' in model);
        assert.ok('canViewReviews' in model);
    });

    test('nodes relationship', function(assert) {
        const model = this.owner.lookup('service:store').modelFor('user');
        const relationship = get(model, 'relationshipsByName').get('nodes');

        assert.equal(relationship.key, 'nodes');
        assert.equal(relationship.type, 'node');
        assert.equal(relationship.kind, 'hasMany');
    });

    test('registrations relationship', function(assert) {
        const model = this.owner.lookup('service:store').modelFor('user');
        const relationship = get(model, 'relationshipsByName').get('registrations');

        assert.equal(relationship.key, 'registrations');
        assert.equal(relationship.type, 'registration');
        assert.equal(relationship.kind, 'hasMany');
    });

    test('institutions relationship', function(assert) {
        const model = this.owner.lookup('service:store').modelFor('user');
        const relationship = get(model, 'relationshipsByName').get('institutions');

        assert.equal(relationship.key, 'institutions');
        assert.equal(relationship.type, 'institution');
        assert.equal(relationship.kind, 'hasMany');
    });
});
