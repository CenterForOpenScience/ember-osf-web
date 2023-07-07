import { getSchemaBlockGroups, SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import { module, test } from 'qunit';

module('Unit | Packages | registration-schema | get-schema-block-group', () => {
    test('Get groups from a schema', function(assert) {
        const testSchema: SchemaBlock[] = [
            {
                blockType: 'section-heading',
                displayText: 'Section in the First Page',
                index: 0,
            },
            {
                blockType: 'short-text-input',
                schemaBlockGroupKey: 'q1',
                registrationResponseKey: 'a1',
                index: 1,
            },
            {
                blockType: 'subsection-heading',
                displayText: 'Subsection after first input',
                index: 2,
            },
            {
                blockType: 'question-label',
                displayText: 'Multi Select',
                schemaBlockGroupKey: 'testMulti',
                index: 3,
            },
            {
                blockType: 'multi-select-input',
                schemaBlockGroupKey: 'testMulti',
                registrationResponseKey: 'testMultiAnswer',
                index: 4,
            },
            {
                blockType: 'select-input-option',
                schemaBlockGroupKey: 'testMulti',
                displayText: 'Multi-option 1',
                index: 5,
            },
            {
                blockType: 'select-input-option',
                schemaBlockGroupKey: 'testMulti',
                displayText: 'Multi-option 2',
                index: 6,
            },
            {
                blockType: 'select-input-option',
                schemaBlockGroupKey: 'testMulti',
                displayText: 'Multi-option 3',
                index: 7,
            },
            {
                blockType: 'question-label',
                displayText: 'Single Select',
                schemaBlockGroupKey: 'testSingle',
                index: 8,
            },
            {
                blockType: 'single-select-input',
                schemaBlockGroupKey: 'testSingle',
                registrationResponseKey: 'testSingleAnswer',
                index: 9,
            },
            {
                blockType: 'select-input-option',
                schemaBlockGroupKey: 'testSingle',
                displayText: 'single-option 1',
                index: 10,
            },
            {
                blockType: 'select-input-option',
                schemaBlockGroupKey: 'testSingle',
                displayText: 'single-option 2',
                index: 11,
            },
        ];
        const result = getSchemaBlockGroups(testSchema);
        if (!result) {
            throw new Error('getSchemaBlockGroups() returned undefined');
        }
        // section heading
        assert.notOk(result[0].registrationResponseKey, 'section heading has proper registrationResponseKey (none)');
        assert.ok(result[0].labelBlock, 'section heading has labelBlock');
        assert.equal(result[0].blocks!.length, 1, 'section heading has proper blocks length (1)');
        // standalone text input
        assert.equal(result[1].registrationResponseKey, 'a1',
            'standalone text input has proper registrationResponseKey');
        assert.equal(result[1].schemaBlockGroupKey, 'q1',
            'standalone text input has proper schemaBlockGroupKey');
        assert.notOk(result[1].optionBlocks, 'standalone text input has proper optionBlocks (none)');
        assert.equal(result[1].blocks!.length, 1, 'standalone text input has proper blocks length (1)');
        // subsection heading
        assert.notOk(result[2].registrationResponseKey, 'subsection heading has proper registrationResponseKey (none)');
        assert.ok(result[2].labelBlock, 'subsection heading has labelBlock');
        assert.equal(result[2].blocks!.length, 1, 'subsection heading has proper blocks length (1)');
        // multi select
        assert.equal(result[3].registrationResponseKey, 'testMultiAnswer',
            'multi select has proper registrationResponseKey');
        assert.equal(result[3].schemaBlockGroupKey, 'testMulti',
            'multi select has proper schemaBlockGroupKey');
        assert.equal(result[3].optionBlocks!.length, 3, 'multi select has proper optionBlocks');
        assert.equal(result[3].blocks!.length, 5, 'multi select has proper blocks length (5)');
        // single select
        assert.equal(result[4].registrationResponseKey, 'testSingleAnswer',
            'single select has proper registrationResponseKey');
        assert.equal(result[4].schemaBlockGroupKey, 'testSingle',
            'single select has proper schemaBlockGroupKey');
        assert.equal(result[4].optionBlocks!.length, 2, 'single select has proper optionsBlocks');
        assert.equal(result[4].blocks!.length, 4, 'single select has proper blocks length (4)');
    });
});
