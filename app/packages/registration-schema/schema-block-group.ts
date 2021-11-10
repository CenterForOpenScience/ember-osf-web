import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';

export interface SchemaBlockGroup {
    inputType?: string | null;
    labelBlock?: SchemaBlock;
    inputBlock?: SchemaBlock;
    optionBlocks?: SchemaBlock[];
    schemaBlockGroupKey?: string;
    registrationResponseKey?: string | null;
    groupType?: string;
    blocks?: SchemaBlock[];
    updated?: boolean;
  }
