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

    test('it has an attribute: actionTrigger', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('review-action'));
        const hasAttr = Object.keys(model.toJSON()).indexOf('actionTrigger') > -1;
        assert.ok(hasAttr);
    });

    test('it has an attribute: comment', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('review-action'));
        const hasAttr = Object.keys(model.toJSON()).indexOf('comment') > -1;
        assert.ok(hasAttr);
    });

    test('it has an attribute: fromState', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('review-action'));
        const hasAttr = Object.keys(model.toJSON()).indexOf('fromState') > -1;
        assert.ok(hasAttr);
    });

    test('it has an attribute: toState', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('review-action'));
        const hasAttr = Object.keys(model.toJSON()).indexOf('toState') > -1;
        assert.ok(hasAttr);
    });

    test('it has an attribute: dateCreated', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('review-action'));
        const hasAttr = Object.keys(model.toJSON()).indexOf('dateCreated') > -1;
        assert.ok(hasAttr);
    });

    test('it has an attribute: dateModified', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('review-action'));
        const hasAttr = Object.keys(model.toJSON()).indexOf('dateModified') > -1;
        assert.ok(hasAttr);
    });

    test('it has an attribute: actionTrigger', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('review-action'));
        const hasAttr = Object.keys(model.toJSON()).indexOf('actionTrigger') > -1;
        assert.ok(hasAttr);
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
