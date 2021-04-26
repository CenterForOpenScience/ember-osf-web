/* eslint-disable camelcase */
// tslint:disable import-spacing

import RegistrationSchema from 'ember-osf-web/models/registration-schema';

import as_predicted_preregistration from
    '../fixture-data/registration-schemas/as-predicted-preregistration';
import open_ended_registration from
    '../fixture-data/registration-schemas/open-ended-registration';
import osf_standard_pre_data_collection_registration from
    '../fixture-data/registration-schemas/osf-standard-pre-data-collection-registration';
import pre_registration_in_social_psychology from
    '../fixture-data/registration-schemas/pre-registration-in-social-psychology';
import prereg_challenge from
    '../fixture-data/registration-schemas/prereg-challenge';
import registered_report_protocol_preregistration from
    '../fixture-data/registration-schemas/registered-report-protocol-preregistration';
import replication_recipe_post_completion from
    '../fixture-data/registration-schemas/replication-recipe-post-completion';
import replication_recipe_pre_registration from
    '../fixture-data/registration-schemas/replication-recipe-pre-registration';
import { ids } from './schema-blocks';

export type MirageRegistrationSchema =
    Pick<RegistrationSchema, 'id' | 'active' | 'name' | 'schemaVersion' > &
    {
        schemaNoConflict: RegistrationSchema['schema'],
        schemaBlockIds?: string[],
    };

const testSchema = {
    id: 'testSchema',
    active: true,
    name: 'This is a Test Schema',
    schemaVersion: 801,
    schemaBlockIds: ids,
    schemaNoConflict: {
        title: 'Fake title for testing',
        pages: [],
    },
};

const testSchemaTwo = {
    id: 'testSchemaTwo',
    active: true,
    name: 'This is a second Test Schema',
    schemaVersion: 801,
    schemaBlockIds: ids,
    schemaNoConflict: {
        title: 'Fake title for testing',
        pages: [],
    },
};

const testSchemaThree = {
    id: 'testSchemaThree',
    active: true,
    name: 'This is a third Test Schema',
    schemaVersion: 801,
    schemaBlockIds: ids,
    schemaNoConflict: {
        title: 'Fake title for testing',
        pages: [],
    },
};

export default [
    prereg_challenge,
    open_ended_registration,
    as_predicted_preregistration,
    registered_report_protocol_preregistration,
    osf_standard_pre_data_collection_registration,
    replication_recipe_post_completion,
    replication_recipe_pre_registration,
    pre_registration_in_social_psychology,
    testSchema,
    testSchemaTwo,
    testSchemaThree,
] as MirageRegistrationSchema[];

/* eslint-enable camelcase */
