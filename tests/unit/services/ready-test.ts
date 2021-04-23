import { run } from '@ember/runloop';
import { settled } from '@ember/test-helpers';
import Ready from 'ember-osf-web/services/ready';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Service | ready', hooks => {
    setupTest(hooks);

    // Set up ready/error listeners with assertions inside.
    // Adds 2 expected assertions for either success or failure.
    function setUpListeners(assert: any, ready: Ready, expectSuccess: boolean) {
        ready.on('ready', () => {
            assert.ok(expectSuccess, '"ready" event triggered');
        });
        ready.on('error', () => {
            assert.ok(!expectSuccess, '"error" event triggered');
        });

        ready.ready().then(
            () => {
                assert.ok(expectSuccess, 'ready.ready() resolves');
            },
            () => {
                assert.ok(!expectSuccess, 'ready.ready() rejects');
            },
        );
    }

    test('one blocker', async function(assert) {
        assert.expect(4);

        const ready = this.owner.lookup('service:ready');
        const blocker = ready.getBlocker();

        setUpListeners(assert, ready, true);

        assert.notOk(ready.get('isReady'), 'starts unready');

        run(() => {
            blocker.done();
        });
        await settled();
        assert.ok(ready.get('isReady'), 'ends ready');
    });

    test('three blockers', async function(assert) {
        assert.expect(5);

        const ready = this.owner.lookup('service:ready');
        const blocker1 = ready.getBlocker();
        const blocker2 = ready.getBlocker();
        const blocker3 = ready.getBlocker();

        setUpListeners(assert, ready, true);

        assert.notOk(ready.get('isReady'), 'starts unready');

        run(() => {
            blocker2.done();
            blocker3.done();
        });
        await settled();
        assert.notOk(ready.get('isReady'), 'still waiting on one blocker');

        run(() => {
            blocker1.done();
        });
        await settled();
        assert.ok(ready.get('isReady'), 'ends ready');
    });

    test('one blocker errors', async function(assert) {
        assert.expect(4);

        const ready = this.owner.lookup('service:ready');
        const blocker = ready.getBlocker();

        setUpListeners(assert, ready, false);

        assert.notOk(ready.get('isReady'), 'starts unready');

        blocker.errored();
        await settled();
        assert.notOk(ready.get('isReady'), 'never ready');
    });

    test('third blocker errors', async function(assert) {
        assert.expect(5);

        const ready = this.owner.lookup('service:ready');
        const blocker1 = ready.getBlocker();
        const blocker2 = ready.getBlocker();
        const blocker3 = ready.getBlocker();

        setUpListeners(assert, ready, false);

        assert.notOk(ready.get('isReady'), 'starts unready');

        run(() => {
            blocker2.done();
            blocker3.done();
        });
        await settled();
        assert.notOk(ready.get('isReady'), 'still waiting on one blocker');

        blocker1.errored();
        await settled();
        assert.notOk(ready.get('isReady'), 'never ready');
    });
});
