import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | review-action', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('review-action'));
        assert.ok(!!model);
    });

    test('it has appropriate attributes', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('review-action'));
        assert.ok('actionTrigger' in model);
        assert.ok('comment' in model);
        assert.ok('fromState' in model);
        assert.ok('toState' in model);
        assert.ok('dateCreated' in model);
        assert.ok('dateModified' in model);
        assert.ok('actionTrigger' in model);
    });

    test('target relationship', function(assert) {
        const model = this.owner.lookup('service:store').modelFor('review-action');
        const relationship = get(model, 'relationshipsByName').get('target');

        assert.equal(relationship.key, 'target');
        assert.equal(relationship.type, 'registration');
        assert.equal(relationship.kind, 'belongsTo');
    });

    test('user relationship', function(assert) {
        const model = this.owner.lookup('service:store').modelFor('review-action');
        const relationship = get(model, 'relationshipsByName').get('creator');

        assert.equal(relationship.key, 'creator');
        assert.equal(relationship.type, 'user');
        assert.equal(relationship.kind, 'belongsTo');
    });
});
