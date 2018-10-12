import { guid } from 'ember-osf-web/mirage/factories/utils';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Mirage | Factories | Utils | guid generation', hooks => {
    setupTest(hooks);

    test('it can create guids', assert => {
        const guidFactory = guid('node');
        const generatedGuids: Record<string, true> = {};

        // https://oeis.org/A028355
        for (const i of [1, 2, 3, 4, 32, 123, 43, 2123, 432, 1234, 32123, 43212]) {
            // Should generate the same guid for the same input
            const newGuid = guidFactory(i);
            assert.equal(newGuid, guidFactory(i));

            // Shouldn't repeat itself
            assert.notOk(generatedGuids[newGuid]);
            generatedGuids[newGuid] = true;
        }
    });
});
