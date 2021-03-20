import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { BufferedChangeset, ValidatorMap } from 'ember-changeset/types';

export interface Config {
  skipValidate?: boolean;
  changesetKeys?: string[];
}

export default function buildChangeset(target: object, validationMap: ValidatorMap, options?: Config) {
    return Changeset(target, lookupValidator(validationMap), validationMap, options) as BufferedChangeset;
}
