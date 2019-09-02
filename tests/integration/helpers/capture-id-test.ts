import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Helper | capture-id', hooks => {
    setupRenderingTest(hooks);

    test('it captures ids', async function(assert) {
        const ids = new Set<string>();

        for (const _ of Array.from({ length: 100 })) {
            await render(hbs`{{capture-id}}`);
            const capturedId = this.element.textContent!.trim();

            assert.ok(typeof capturedId === 'string', 'is a string');
            assert.ok(capturedId.length >= 5, 'is reasonably long (at least 5 chars)');
            assert.ok(!ids.has(capturedId), 'has not already been seen');

            ids.add(capturedId);
        }
    });

    test('it prefixes', async function(assert) {
        const prefixes = [
            'prefix',
            'xiferp',
            1,
            2,
        ];
        for (const prefix of prefixes) {
            this.setProperties({ prefix });

            await render(hbs`{{capture-id this.prefix}}`);
            const capturedId = this.element.textContent!.trim();

            assert.ok(capturedId.startsWith(prefix.toString()), `starts with "${prefix}"`);
        }
    });
});
