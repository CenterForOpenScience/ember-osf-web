import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | registration', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        assert.ok(!!model);
    });

    test('it selects public as default state', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));

        assert.equal(model.get('state'), 'public');
    });

    test('it returns pendingRegistrationApproval if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('pendingRegistrationApproval', true);

        assert.equal(model.get('state'), 'pendingRegistrationApproval');
    });

    test('it returns pendingEmbargoApproval if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('pendingEmbargoApproval', true);

        assert.equal(model.get('state'), 'pendingEmbargoApproval');
    });

    test('it returns pendingEmbargoTerminationApproval if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('pendingEmbargoTerminationApproval', true);

        assert.equal(model.get('state'), 'pendingEmbargoTerminationApproval');
    });

    test('it returns pendingWithdrawal if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('pendingWithdrawal', true);

        assert.equal(model.get('state'), 'pendingWithdrawal');
    });

    test('it returns withdrawn if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('withdrawn', true);

        assert.equal(model.get('state'), 'withdrawn');
    });

    test('it returns embargoed if field is true', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration'));
        model.set('embargoed', true);

        assert.equal(model.get('state'), 'embargoed');
    });
});
