import { SchemaBlock } from 'ember-osf-web/packages/registration-schema/schema-block';

export interface SchemaBlockGroup {
    labelBlock?: SchemaBlock;
    inputBlock?: SchemaBlock;
    optionBlocks?: SchemaBlock[];
    schemaBlockGroupKey?: string;
    registrationResponseKey?: string;
  }
