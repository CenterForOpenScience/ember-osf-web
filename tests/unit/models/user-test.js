import { get } from '@ember/object';
import {
    moduleForModel,
    test,
} from 'ember-qunit';

moduleForModel('user', 'Unit | Model | user', {
    // Specify the other units that are required for this test.
    needs: ['model:node',
        'model:institution',
        'model:registration',
        'model:file',
        'model:review-action',
        'transform:fixstring',
        'transform:links',
        'transform:embed'],
});

test('it exists', function(assert) {
    const model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});

test('it has an attribute: fullName', function(assert) {
    const model = this.subject();
    const hasAttr = Object.keys(model.toJSON()).indexOf('fullName') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: givenName', function(assert) {
    const model = this.subject();
    const hasAttr = Object.keys(model.toJSON()).indexOf('givenName') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: middleNames', function(assert) {
    const model = this.subject();
    const hasAttr = Object.keys(model.toJSON()).indexOf('middleNames') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: familyName', function(assert) {
    const model = this.subject();
    const hasAttr = Object.keys(model.toJSON()).indexOf('familyName') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: dateRegistered', function(assert) {
    const model = this.subject();
    const hasAttr = Object.keys(model.toJSON()).indexOf('dateRegistered') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: username', function(assert) {
    const model = this.subject();
    const hasAttr = Object.keys(model.toJSON()).indexOf('username') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: fullName', function(assert) {
    const model = this.subject();
    const hasAttr = Object.keys(model.toJSON()).indexOf('fullName') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: canViewReviews', function(assert) {
    const model = this.subject();
    const hasAttr = Object.keys(model.toJSON()).indexOf('canViewReviews') > -1;
    assert.ok(hasAttr);
});

test('nodes relationship', function(assert) {
    const model = this.store().modelFor('user');
    const relationship = get(model, 'relationshipsByName').get('nodes');

    assert.equal(relationship.key, 'nodes');
    assert.equal(relationship.type, 'node');
    assert.equal(relationship.kind, 'hasMany');
});

test('registrations relationship', function(assert) {
    const model = this.store().modelFor('user');
    const relationship = get(model, 'relationshipsByName').get('registrations');

    assert.equal(relationship.key, 'registrations');
    assert.equal(relationship.type, 'registration');
    assert.equal(relationship.kind, 'hasMany');
});

test('files relationship', function(assert) {
    const model = this.store().modelFor('user');
    const relationship = get(model, 'relationshipsByName').get('quickfiles');

    assert.equal(relationship.key, 'quickfiles');
    assert.equal(relationship.type, 'file');
    assert.equal(relationship.kind, 'hasMany');
});

test('institutions relationship', function(assert) {
    const model = this.store().modelFor('user');
    const relationship = get(model, 'relationshipsByName').get('affiliatedInstitutions');

    assert.equal(relationship.key, 'affiliatedInstitutions');
    assert.equal(relationship.type, 'institution');
    assert.equal(relationship.kind, 'hasMany');
});
