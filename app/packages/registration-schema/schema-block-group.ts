import SchemaBlockModel from 'ember-osf-web/models/schema-block';

export interface SchemaBlockGroup {
    inputType?: string | null;
    labelBlock?: SchemaBlockModel;
  inputBlock?: SchemaBlockModel;
  optionBlocks?: SchemaBlockModel[];
    schemaBlockGroupKey?: string;
    registrationResponseKey?: string;
    groupType?: string;
  blocks?: SchemaBlockModel[];
  }
