import { hasValidationError } from 'osf-components/helpers/has-validation-error';
import { module, test } from 'qunit';

module('Unit | Helper | has-validation-error', () => {
    test('it detects validation errors', function(assert) {
        assert.ok(
            hasValidationError([['error message']]),
            'single error',
        );
        assert.ok(
            hasValidationError([['error message 1', 'error message 2', 'error message 3']]),
            'multiple errors',
        );
        assert.ok(
            hasValidationError([['error message 1', true, 'error message 2']]),
            'mixed errors/success',
        );
    });

    test('it detects validation successes', function(assert) {
        assert.notOk(
            hasValidationError([[true]]),
            'single success',
        );
        assert.notOk(
            hasValidationError([[true, true, true]]),
            'multiple successes',
        );
        assert.notOk(
            hasValidationError([[]]),
            'empty',
        );
        assert.notOk(
            hasValidationError([undefined]),
            'undefined',
        );
    });
});
