import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | registration', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        assert.ok(!!model);
    });

    test('registraiton state selects public as default', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));

        assert.equal(model.get('state'), 'public');
    });

    test('registration state returns pendingRegistrationApproval if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('pendingRegistrationApproval', true);

        assert.equal(model.get('state'), 'pendingRegistrationApproval');
    });

    test('registration state returns pendingEmbargoApproval if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('pendingEmbargoApproval', true);

        assert.equal(model.get('state'), 'pendingEmbargoApproval');
    });

    test('registration state return pendingEmbargoTerminationApproval if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('pendingEmbargoTerminationApproval', true);

        assert.equal(model.get('state'), 'pendingEmbargoTerminationApproval');
    });

    test('registartion state returns pendingWithdrawal if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('pendingWithdrawal', true);

        assert.equal(model.get('state'), 'pendingWithdrawal');
    });

    test('registartion state returns withdrawn if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('withdrawn', true);

        assert.equal(model.get('state'), 'withdrawn');
    });

    test('registration state returns embargoed if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('embargoed', true);

        assert.equal(model.get('state'), 'embargoed');
    });

    test('registration state updates when the model changes', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('embargoed', true);
        assert.equal(model.get('state'), 'embargoed');

        model.set('withdrawn', true);
        assert.equal(model.get('state'), 'withdrawn');
    });
});
