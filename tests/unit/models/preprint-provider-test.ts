import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | preprint-provider', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('preprint-provider'));
        assert.ok(!!model);
    });

    test('it has the correct provider title', function(assert) {
        const store = this.owner.lookup('service:store');
        const thesisCommons = store.createRecord('preprint-provider', { id: 'thesiscommons', name: 'Thesis Commons' });
        assert.equal(thesisCommons.get('providerTitle'), 'Thesis Commons');

        const osf = store.createRecord('preprint-provider', { id: 'osf', preprintWord: 'preprint' });
        assert.equal(osf.get('providerTitle'), 'OSF Preprints');

        const workrxiv = store.createRecord('preprint-provider', {
            id: 'workrxiv', preprintWord: 'paper', name: 'WorkrXiv',
        });
        assert.equal(workrxiv.get('providerTitle'), 'WorkrXiv Papers');
    });
});
