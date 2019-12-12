import DS from 'ember-data';

import { RegistrationResponse } from 'ember-osf-web/packages/registration-schema';

import ContributorModel from './contributor';
import InstitutionModel from './institution';
import LicenseModel from './license';
import NodeModel, { NodeCategory, NodeLicense } from './node';
import OsfModel from './osf-model';
import RegistrationSchemaModel, { RegistrationMetadata } from './registration-schema';
import SubjectModel from './subject';
import UserModel from './user';

const { attr, belongsTo, hasMany } = DS;

export default class DraftRegistrationModel extends OsfModel {
    @attr('fixstring') registrationSupplement!: string;
    @attr('object') registrationMetadata!: RegistrationMetadata;
    @attr('registration-responses') registrationResponses!: RegistrationResponse;
    @attr('date') datetimeInitiated!: Date;
    @attr('date') datetimeUpdated!: Date;

    @attr('fixstring') title!: string;
    @attr('fixstring') description!: string;
    @attr('fixstring') registrationDOI!: string | null;
    @attr('fixstring') articleDOI!: string | null;
    @attr('fixstringarray') tags!: string[];
    @attr('node-license') nodeLicense!: NodeLicense | null;
    @attr('node-category') category!: NodeCategory;

    @belongsTo('node', { inverse: 'draftRegistrations' })
    branchedFrom!: DS.PromiseObject<NodeModel> & NodeModel;

    @belongsTo('user', { inverse: null })
    initiator!: DS.PromiseObject<UserModel> & UserModel;

    @belongsTo('registration-schema', { inverse: null })
    registrationSchema!: DS.PromiseObject<RegistrationSchemaModel> & RegistrationSchemaModel;

    @hasMany('contributor', { inverse: 'node' })
    contributors!: DS.PromiseManyArray<ContributorModel>;

    @hasMany('contributor', { inverse: null })
    bibliographicContributors!: DS.PromiseManyArray<ContributorModel>;

    @hasMany('institution', { inverse: 'nodes' })
    affiliatedInstitutions!: DS.PromiseManyArray<InstitutionModel> | InstitutionModel[];

    @hasMany('subject', { inverse: null, async: false })
    subjects!: SubjectModel[];

    @belongsTo('license', { inverse: null })
    license!: DS.PromiseObject<LicenseModel> & LicenseModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'draft-registration': DraftRegistrationModel;
    } // eslint-disable-line semi
}
