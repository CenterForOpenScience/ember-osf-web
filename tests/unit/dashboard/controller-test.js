import { moduleFor, test, skip } from 'ember-qunit';

moduleFor('controller:dashboard', 'Unit | Controller | dashboard', {
    needs: ['service:currentUser', 'service:session', 'model:institution',
        'model:node'],
});


skip(() => {
    test('it exists', function(assert) {
        const controller = this.subject();
        // TODO: init calls out requests, need to mock them to have this pass
        assert.ok(controller);
    });
});
