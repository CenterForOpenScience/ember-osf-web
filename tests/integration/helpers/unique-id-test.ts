import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Helper | unique-id', hooks => {
    setupRenderingTest(hooks);

    test('it captures ids', async function(assert) {
        const ids = new Set<string>();

        for (const _ of Array.from({ length: 100 })) {
            await render(hbs`{{unique-id}}`);
            const uniqueId = this.element.textContent!.trim();

            assert.ok(typeof uniqueId === 'string', 'is a string');
            assert.ok(uniqueId.length >= 5, 'is reasonably long (at least 5 chars)');
            assert.ok(!ids.has(uniqueId), 'has not already been seen');

            ids.add(uniqueId);
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

            await render(hbs`{{unique-id this.prefix}}`);
            const uniqueId = this.element.textContent!.trim();

            assert.ok(uniqueId.startsWith(prefix.toString()), `starts with "${prefix}"`);
        }
    });
});
