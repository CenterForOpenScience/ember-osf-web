import DS from 'ember-data';

import { RegistrationResponse } from 'ember-osf-web/packages/registration-schema';

import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import InstitutionModel from './institution';
import LicenseModel from './license';
import NodeModel, { NodeCategory, NodeLicense } from './node';
import OsfModel from './osf-model';
import RegistrationSchemaModel, { RegistrationMetadata } from './registration-schema';
import SubjectModel from './subject';
import UserModel from './user';

const { attr, belongsTo, hasMany } = DS;

export enum DraftMetadataProperties {
    Title = 'title',
    Description = 'description',
    Tags = 'tags',
    Category = 'category',
    License = 'license',
    NodeLicenseProperty = 'nodeLicense',
    Subjects = 'subjects',
}

export default class DraftRegistrationModel extends OsfModel {
    @attr('fixstring') registrationSupplement!: string;
    @attr('object') registrationMetadata!: RegistrationMetadata;
    @attr('registration-responses') registrationResponses!: RegistrationResponse;
    @attr('date') datetimeInitiated!: Date;
    @attr('date') datetimeUpdated!: Date;

    @attr('fixstring') title!: string;
    @attr('fixstring') description!: string;
    @attr('fixstringarray') tags!: string[];
    @attr('node-license') nodeLicense!: NodeLicense | null;
    @attr('node-category') category!: NodeCategory;

    @belongsTo('node', { inverse: 'draftRegistrations' })
    branchedFrom!: DS.PromiseObject<NodeModel> & NodeModel;

    @belongsTo('user', { inverse: null })
    initiator!: DS.PromiseObject<UserModel> & UserModel;

    @belongsTo('registration-schema', { inverse: null })
    registrationSchema!: DS.PromiseObject<RegistrationSchemaModel> & RegistrationSchemaModel;

    @belongsTo('registration-provider', { inverse: null })
    provider!: DS.PromiseObject<RegistrationProviderModel> & RegistrationProviderModel;

    @hasMany('institution', { inverse: null, async: false })
    affiliatedInstitutions!: DS.PromiseManyArray<InstitutionModel>;

    @hasMany('subject', { inverse: null, async: false })
    subjects!: SubjectModel[];

    @belongsTo('license', { inverse: null, async: false })
    license!: DS.PromiseObject<LicenseModel> & LicenseModel;

    @belongsTo('registration-provider', { inverse: null })
    provider!: DS.PromiseObject<RegistrationProviderModel> & RegistrationProviderModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'draft-registration': DraftRegistrationModel;
    } // eslint-disable-line semi
}
