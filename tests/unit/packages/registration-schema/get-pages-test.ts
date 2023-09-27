import { getPages, SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import { module, test } from 'qunit';

module('Unit | Packages | registration-schema | get-pages', () => {
    test('Group multipage schema', function(assert) {
        const multipageSchema: SchemaBlock[] = [
            {
                blockType: 'page-heading',
                displayText: 'First Page',
                index: 0,
            },
            {
                blockType: 'section-heading',
                displayText: 'Section in the First Page',
                index: 1,
            },
            {
                blockType: 'question-label',
                displayText: 'Question Title in the First Page',
                schemaBlockGroupKey: 'q1',
                index: 2,
            },
            {
                blockType: 'short-text-input',
                displayText: 'Text Input in the First Page',
                schemaBlockGroupKey: 'q1',
                registrationResponseKey: 'a1',
                index: 3,
            },
            {
                blockType: 'page-heading',
                displayText: 'Second Page',
                index: 4,
            },
            {
                blockType: 'section-heading',
                displayText: 'Section in the Second Page',
                index: 5,
            },
            {
                blockType: 'question-label',
                displayText: 'Single Select on Page Two',
                schemaBlockGroupKey: 'q2',
                index: 6,
            },
            {
                blockType: 'single-select-input',
                schemaBlockGroupKey: 'q2',
                registrationResponseKey: 'a2',
                index: 7,
            },
            {
                blockType: 'select-input-option',
                displayText: 'Opt1 for Single Select',
                schemaBlockGroupKey: 'q2',
                index: 8,
            },
            {
                blockType: 'select-input-option',
                displayText: 'Opt2 for Single Select',
                schemaBlockGroupKey: 'q2',
                index: 9,
            },
            {
                blockType: 'page-heading',
                displayText: 'Third Page',
                index: 10,
            },
            {
                blockType: 'section-heading',
                displayText: 'Section in the Third Page',
                index: 11,
            },
        ];
        const result = getPages(multipageSchema);
        assert.equal(result.length, 3, 'has proper page length');
    });

    test('Group single page schema', function(assert) {
        const singlepageSchema: SchemaBlock[] = [
            {
                blockType: 'page-heading',
                displayText: 'First Page',
                index: 0,
            },
            {
                blockType: 'section-heading',
                displayText: 'Section in the First Page',
                index: 1,
            },
            {
                blockType: 'question-label',
                displayText: 'Question Title in the First Page',
                schemaBlockGroupKey: 'q1',
                index: 2,
            },
            {
                blockType: 'short-text-input',
                displayText: 'Text Input in the First Page',
                schemaBlockGroupKey: 'q1',
                registrationResponseKey: 'a1',
                index: 3,
            },
        ];
        const result = getPages(singlepageSchema);
        assert.equal(result.length, 1, 'has proper page length');
    });

    test('Group schema with no page-heading', function(assert) {
        const noPageHeadingSchema: SchemaBlock[] = [
            {
                blockType: 'section-heading',
                displayText: 'Section in the First Page',
                index: 0,
            },
            {
                blockType: 'question-label',
                displayText: 'Question Title in the First Page',
                schemaBlockGroupKey: 'q1',
                index: 1,
            },
            {
                blockType: 'short-text-input',
                displayText: 'Text Input in the First Page',
                schemaBlockGroupKey: 'q1',
                registrationResponseKey: 'a1',
                index: 2,
            },
        ];
        const result = getPages(noPageHeadingSchema);
        assert.equal(result.length, 1, 'has proper page length');
    });
});
