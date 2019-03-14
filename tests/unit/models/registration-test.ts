import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | registration', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        assert.ok(!!model);
    });

    test('state selects public as default', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));

        assert.equal(model.get('state'), 'Public');
    });

    test('state returns pendingRegistrationApproval if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('pendingRegistrationApproval', true);

        assert.equal(model.get('state'), 'PendingRegistration');
    });

    test('state returns pendingEmbargoApproval if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('pendingEmbargoApproval', true);

        assert.equal(model.get('state'), 'PendingEmbargo');
    });

    test('state return pendingEmbargoTerminationApproval if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('pendingEmbargoTerminationApproval', true);

        assert.equal(model.get('state'), 'PendingEmbargoTermination');
    });

    test('state returns pendingWithdrawal if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('pendingWithdrawal', true);

        assert.equal(model.get('state'), 'PendingWithdrawal');
    });

    test('state returns withdrawn if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('withdrawn', true);

        assert.equal(model.get('state'), 'Withdrawn');
    });

    test('state returns embargoed if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('embargoed', true);

        assert.equal(model.get('state'), 'Embargoed');
    });

    test('state returns pendingEmbargoTerminationApproval if both it and embargo are true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('embargoed', true);
        model.set('pendingEmbargoTerminationApproval', true);

        assert.equal(model.get('state'), 'PendingEmbargoTermination');
    });

    test('state returns pendingWithdrawal if both it and public are true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('public', true);
        model.set('pendingWithdrawal', true);

        assert.equal(model.get('state'), 'PendingWithdrawal');
    });

    test('state updates when the model changes', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('embargoed', true);
        assert.equal(model.get('state'), 'Embargoed');

        model.set('withdrawn', true);
        assert.equal(model.get('state'), 'Withdrawn');
    });
});
