import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | preprint', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('preprint'));
        assert.ok(!!model);
    });

    test('it has appropriate attributes', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('preprint'));
        assert.ok('title' in model);
        assert.ok('dateCreated' in model);
        assert.ok('datePublished' in model);
        assert.ok('originalPublicationDate' in model);
        assert.ok('dateModified' in model);
        assert.ok('doi' in model);
        assert.ok('isPublished' in model);
        assert.ok('isPreprintOrphan' in model);
        assert.ok('licenseRecord' in model);
        assert.ok('reviewsState' in model);
        assert.ok('dateLastTransitioned' in model);
    });

    test('node relationship', function(assert) {
        const model = this.owner.lookup('service:store').modelFor('preprint');
        const relationship = get(model, 'relationshipsByName').get('node');

        assert.equal(relationship.key, 'node');
        assert.equal(relationship.type, 'node');
        assert.equal(relationship.kind, 'belongsTo');
    });

    test('license relationship', function(assert) {
        const model = this.owner.lookup('service:store').modelFor('preprint');
        const relationship = get(model, 'relationshipsByName').get('license');

        assert.equal(relationship.key, 'license');
        assert.equal(relationship.type, 'license');
        assert.equal(relationship.kind, 'belongsTo');
    });

    test('file relationship', function(assert) {
        const model = this.owner.lookup('service:store').modelFor('preprint');
        const relationship = get(model, 'relationshipsByName').get('primaryFile');

        assert.equal(relationship.key, 'primaryFile');
        assert.equal(relationship.type, 'file');
        assert.equal(relationship.kind, 'belongsTo');
    });

    test('preprint-provider relationship', function(assert) {
        const model = this.owner.lookup('service:store').modelFor('preprint');
        const relationship = get(model, 'relationshipsByName').get('provider');

        assert.equal(relationship.key, 'provider');
        assert.equal(relationship.type, 'preprint-provider');
        assert.equal(relationship.kind, 'belongsTo');
    });

    test('review-action relationship', function(assert) {
        const model = this.owner.lookup('service:store').modelFor('preprint');
        const relationship = get(model, 'relationshipsByName').get('reviewActions');

        assert.equal(relationship.key, 'reviewActions');
        assert.equal(relationship.type, 'review-action');
        assert.equal(relationship.kind, 'hasMany');
    });

    test('contributors relationship', function(assert) {
        const model = this.owner.lookup('service:store').modelFor('preprint');
        const relationship = get(model, 'relationshipsByName').get('contributors');

        assert.equal(relationship.key, 'contributors');
        assert.equal(relationship.type, 'contributor');
        assert.equal(relationship.kind, 'hasMany');
    });
});
