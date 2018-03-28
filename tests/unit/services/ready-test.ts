import { settled } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Service | ready', hooks => {
    setupTest(hooks);

    // Set up ready/error listeners with assertions inside.
    // Adds 2 expected assertions for either success or failure.
    function setUpListeners(assert, ready, expectSuccess: boolean) {
        ready.on('ready', () => { assert.ok(expectSuccess); });
        ready.on('error', () => { assert.ok(!expectSuccess); });

        ready.ready().then(
            () => { assert.ok(expectSuccess); },
            () => { assert.ok(!expectSuccess); },
        );
    }

    test('one blocker', async function(assert) {
        assert.expect(4);

        const ready = this.owner.lookup('service:ready');
        const blocker = ready.block();

        setUpListeners(assert, ready, true);

        assert.notOk(ready.get('isReady'));

        blocker.done();
        await settled();
        assert.ok(ready.get('isReady'));
    });

    test('three blockers', async function(assert) {
        assert.expect(5);

        const ready = this.owner.lookup('service:ready');
        const blocker1 = ready.block();
        const blocker2 = ready.block();
        const blocker3 = ready.block();

        setUpListeners(assert, ready, true);

        assert.notOk(ready.get('isReady'));

        blocker2.done();
        blocker3.done();
        await settled();
        assert.notOk(ready.get('isReady'));

        blocker1.done();
        await settled();
        assert.ok(ready.get('isReady'));
    });

    // block => errored => isReady false
    // block => errored => error event
    // block => errored => promise reject

    test('one blocker errors', async function(assert) {
        assert.expect(4);

        const ready = this.owner.lookup('service:ready');
        const blocker = ready.block();

        setUpListeners(assert, ready, false);

        assert.notOk(ready.get('isReady'));

        blocker.errored();
        await settled();
        assert.ok(ready.get('isReady'));
    });

    test('three blockers error', async function(assert) {
        assert.expect(5);

        const ready = this.owner.lookup('service:ready');
        const blocker1 = ready.block();
        const blocker2 = ready.block();
        const blocker3 = ready.block();

        setUpListeners(assert, ready, false);

        assert.notOk(ready.get('isReady'));

        blocker2.done();
        blocker3.done();
        await settled();
        assert.notOk(ready.get('isReady'));

        blocker1.done();
        await settled();
        assert.ok(ready.get('isReady'));
    });
});
