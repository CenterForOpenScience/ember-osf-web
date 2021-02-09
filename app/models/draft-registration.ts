import { computed } from '@ember/object';
import DS from 'ember-data';

import { RegistrationResponse } from 'ember-osf-web/packages/registration-schema';

import ContributorModel from './contributor';
import InstitutionModel from './institution';
import LicenseModel from './license';
import NodeModel, { NodeCategory, NodeLicense } from './node';
import OsfModel, { Permission } from './osf-model';
import RegistrationProviderModel from './registration-provider';
import RegistrationSchemaModel, { RegistrationMetadata } from './registration-schema';
import SubjectModel from './subject';
import UserModel from './user';

const { attr, belongsTo, hasMany } = DS;

export enum DraftMetadataProperties {
    Title = 'title',
    Description = 'description',
    Category = 'category',
    AffiliatedInstitutions = 'affiliatedInstitutions',
    License = 'license',
    NodeLicenseProperty = 'nodeLicense',
    Subjects = 'subjects',
    Tags = 'tags',
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
    @attr('array') currentUserPermissions!: Permission[];
    @attr('node-license') nodeLicense!: NodeLicense | null;
    @attr('node-category') category!: NodeCategory;
    @attr('boolean') hasProject!: boolean;

    @belongsTo('node', { inverse: 'draftRegistrations' })
    branchedFrom!: DS.PromiseObject<NodeModel> & NodeModel;

    @belongsTo('user', { inverse: null })
    initiator!: DS.PromiseObject<UserModel> & UserModel;

    @belongsTo('registration-schema', { inverse: null })
    registrationSchema!: DS.PromiseObject<RegistrationSchemaModel> & RegistrationSchemaModel;

    @belongsTo('registration-provider', { inverse: null })
    provider!: DS.PromiseObject<RegistrationProviderModel> & RegistrationProviderModel;

    @hasMany('institution', { inverse: null, async: true })
    affiliatedInstitutions!: DS.PromiseManyArray<InstitutionModel>;

    @hasMany('subject', { inverse: null, async: true })
    subjects!: DS.PromiseObject<SubjectModel[]> & SubjectModel[];

    @belongsTo('license', { inverse: null, async: true })
    license!: DS.PromiseObject<LicenseModel> & LicenseModel;

    @hasMany('contributor')
    contributors!: DS.PromiseManyArray<ContributorModel> & ContributorModel[];

    @computed('currentUserPermissions')
    get userHasAdminPermission() {
        return Array.isArray(this.currentUserPermissions) && this.currentUserPermissions.includes(Permission.Admin);
    }

    @computed('currentUserPermissions')
    get userIsReadOnly() {
        return Array.isArray(this.currentUserPermissions) && this.currentUserPermissions.includes(Permission.Read)
            && this.currentUserPermissions.length === 1;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'draft-registration': DraftRegistrationModel;
    } // eslint-disable-line semi
}
