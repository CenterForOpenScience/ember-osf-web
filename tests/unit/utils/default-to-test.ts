import defaultTo from 'ember-osf-web/utils/default-to';
import { module, test } from 'qunit';

module('Unit | Utility | default-to', () => {
    test('it returns value when defined', assert => {
        const value = 'foo';
        const defaultValue = 'bar';
        const result: string = defaultTo(value, defaultValue);
        assert.equal(result, value);
    });

    test('it returns defaultValue when undefined', assert => {
        const defaultValue = 'bar';
        const result: string = defaultTo(undefined, defaultValue);
        assert.equal(result, defaultValue);
    });

    test('it returns value when null', assert => {
        const value = null;
        const defaultValue = 'bar';
        const result: string | null = defaultTo(value, defaultValue);
        assert.equal(result, value);
    });
});
