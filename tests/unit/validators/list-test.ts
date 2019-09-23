import { ValidatorFunction } from 'ember-changeset-validations';
import { setupTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import validateList, { ListValidatorFunction } from 'ember-osf-web/validators/list';

interface ValidatorTestContext extends TestContext {
    listValidator: ListValidatorFunction;
}

function validateTrue(): ValidatorFunction {
    return (_: string, newValue: unknown) => {
        if (!newValue) {
            return 'false!';
        }
        return true;
    };
}

module('Unit | Validator | list', hooks => {
    setupTest(hooks);

    hooks.beforeEach(function(this: ValidatorTestContext) {
        this.listValidator = validateList(validateTrue());
    });

    test(
        'it returns true when the property is undefined',
        function(this: ValidatorTestContext, assert) {
            const newValue = undefined;
            assert.equal(
                this.listValidator('foo', newValue, undefined, { foo: newValue }, {}),
                true,
            );
        },
    );

    test(
        'it returns true when the list is empty',
        function(this: ValidatorTestContext, assert) {
            const newValue: unknown[] = [];
            assert.equal(
                this.listValidator('foo', newValue, undefined, { foo: newValue }, {}),
                true,
            );
        },
    );

    test(
        'it returns true when all elements validate',
        function(this: ValidatorTestContext, assert) {
            let newValue = [true];
            assert.equal(
                this.listValidator('foo', newValue, undefined, { foo: newValue }, {}),
                true,
                'single element list',
            );

            newValue = [true, true, true];
            assert.equal(
                this.listValidator('foo', newValue, undefined, { foo: newValue }, {}),
                true,
                'multiple element list',
            );
        },
    );

    test(
        'it returns validation errors when at least one element fails validation',
        function(this: ValidatorTestContext, assert) {
            let newValue = [false];
            assert.deepEqual(
                this.listValidator('foo', newValue, undefined, { foo: newValue }, {}),
                ['false!'],
                'single element list with validation error',
            );

            newValue = [true, false, true];
            assert.deepEqual(
                this.listValidator('foo', newValue, undefined, { foo: newValue }, {}),
                [true, 'false!', true],
                'multiple element list with one validation error',
            );

            newValue = [false, true, false];
            assert.deepEqual(
                this.listValidator('foo', newValue, undefined, { foo: newValue }, {}),
                ['false!', true, 'false!'],
                'multiple element list with multiple validation errors',
            );

            newValue = [false, false, false];
            assert.deepEqual(
                this.listValidator('foo', newValue, undefined, { foo: newValue }, {}),
                ['false!', 'false!', 'false!'],
                'multiple element list with all validation errors',
            );
        },
    );
});
