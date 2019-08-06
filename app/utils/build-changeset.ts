import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { ChangesetDef, Config, ValidatorFunc } from 'ember-changeset/types';

interface ValidationMap { [s: string]: ValidatorFunc | ValidatorFunc[]; }

export default function buildChangeset(target: object, validationMap: ValidationMap, options?: Config) {
    return new Changeset(target, lookupValidator(validationMap), validationMap, options) as ChangesetDef;
}
