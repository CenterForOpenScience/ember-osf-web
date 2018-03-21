import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:password-strength', 'Unit | Validator | password-strength', {
    needs: [
        'service:i18n',
        'service:passwordStrength',
        'validator:messages',
    ],
});

const minima: string[] = [
    'test',
    'i89M',
    'Fc95Rjd',
    'v2O9u#k9!F',
    '*T99ny@t^72M',
];

for (let i = 0; i < minima.length; i++) {
    test(`Complexity ${i}`, async function(assert) {
        const validator = this.subject();
        const options = { min: i };
        const builtOptions = validator.buildOptions(options);
        const message = await validator.validate(minima[i], builtOptions.copy());
        assert.equal(message, true);
    });
}
