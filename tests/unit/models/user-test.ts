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

    test('it has an attribute: fullName', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('user'));
        const hasAttr = Object.keys(model.toJSON()).indexOf('fullName') > -1;
        assert.ok(hasAttr);
    });

    test('it has an attribute: givenName', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('user'));
        const hasAttr = Object.keys(model.toJSON()).indexOf('givenName') > -1;
        assert.ok(hasAttr);
    });

    test('it has an attribute: middleNames', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('user'));
        const hasAttr = Object.keys(model.toJSON()).indexOf('middleNames') > -1;
        assert.ok(hasAttr);
    });

    test('it has an attribute: familyName', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('user'));
        const hasAttr = Object.keys(model.toJSON()).indexOf('familyName') > -1;
        assert.ok(hasAttr);
    });

    test('it has an attribute: dateRegistered', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('user'));
        const hasAttr = Object.keys(model.toJSON()).indexOf('dateRegistered') > -1;
        assert.ok(hasAttr);
    });

    test('it has an attribute: fullName', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('user'));
        const hasAttr = Object.keys(model.toJSON()).indexOf('fullName') > -1;
        assert.ok(hasAttr);
    });

    test('it has an attribute: canViewReviews', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('user'));
        const hasAttr = Object.keys(model.toJSON()).indexOf('canViewReviews') > -1;
        assert.ok(hasAttr);
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

    test('files relationship', function(assert) {
        const model = this.owner.lookup('service:store').modelFor('user');
        const relationship = get(model, 'relationshipsByName').get('quickfiles');

        assert.equal(relationship.key, 'quickfiles');
        assert.equal(relationship.type, 'file');
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
