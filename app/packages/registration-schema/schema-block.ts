export type SchemaBlockType =
    'page-heading' |
    'section-heading' |
    'subsection-heading' |
    'paragraph' |
    'question-label' |
    'short-text-input' |
    'long-text-input' |
    'file-input' |
    'contributors-input' |
    'multi-select-input' |
    'single-select-input' |
    'select-input-option' |
    'select-other-option';

export interface SchemaBlock {
    id?: string;
    blockType?: SchemaBlockType;
    schemaBlockGroupKey?: string;
    registrationResponseKey?: string | null;
    displayText?: string;
    helpText?: string;
    exampleText?: string;
    required?: boolean;
    index?: number;
}
