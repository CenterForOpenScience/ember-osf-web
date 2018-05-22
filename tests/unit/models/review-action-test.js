import { get } from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-osf-web/tests/helpers/osf-qunit';

import { run } from '@ember/runloop';

module('Unit | Model | review-action', function(hooks) {
    setupTest(hooks);

    test('it exists', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('review-action'));
        // let store = this.store();
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

    test('preprint-provider relationship', function(assert) {
        const model = this.owner.lookup('service:store').modelFor('review-action');
        const relationship = get(model, 'relationshipsByName').get('provider');

        assert.equal(relationship.key, 'provider');
        assert.equal(relationship.type, 'preprint-provider');
        assert.equal(relationship.kind, 'belongsTo');
    });

    test('target relationship', function(assert) {
        const model = this.owner.lookup('service:store').modelFor('review-action');
        const relationship = get(model, 'relationshipsByName').get('target');

        assert.equal(relationship.key, 'target');
        assert.equal(relationship.type, 'preprint');
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
