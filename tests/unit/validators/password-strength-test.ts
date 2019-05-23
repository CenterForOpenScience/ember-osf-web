import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Validator | password-strength', hooks => {
    setupTest(hooks);

    const minima: string[] = [
        'test',
        'i89M',
        'Fc95Rjd',
        'v2O9u#k9!F',
        '*T99ny@t^72M',
    ];

    for (let i = 0; i < minima.length; i++) {
        test(`Complexity ${i}`, async function(assert) {
            const validator = this.owner.lookup('validator:password-strength');
            const options = { min: i };
            const builtOptions = validator.buildOptions(options);
            const message = await validator.validate(minima[i], Object.assign({}, builtOptions));
            assert.equal(message, true);
        });
    }
});
