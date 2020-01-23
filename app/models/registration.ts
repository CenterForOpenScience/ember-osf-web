import { computed } from '@ember/object';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';

import DraftRegistrationModel from 'ember-osf-web/models/draft-registration';
import { RegistrationResponse } from 'ember-osf-web/packages/registration-schema';

import CommentModel from './comment';
import ContributorModel from './contributor';
import InstitutionModel from './institution';
import NodeModel from './node';
import RegistrationProviderModel from './registration-provider';
import RegistrationSchemaModel, { RegistrationMetadata } from './registration-schema';
import UserModel from './user';

const { attr, belongsTo, hasMany } = DS;

export enum RegistrationState {
    Embargoed = 'Embargoed',
    Public = 'Public',
    Withdrawn = 'Withdrawn',
    PendingRegistration = 'PendingRegistration',
    PendingWithdrawal = 'PendingWithdrawal',
    PendingEmbargo = 'PendingEmbargo',
    PendingEmbargoTermination = 'PendingEmbargoTermination',
}

const Validations = buildValidations({
    license: [
        validator('presence', {
            presence: true,
        }),
    ],
    nodeLicense: [
        validator('presence', {
            presence: true,
        }),
        validator('node-license', {
            on: 'license',
        }),
    ],
});

export default class RegistrationModel extends NodeModel.extend(Validations) {
    @attr('date') dateRegistered!: Date;
    @attr('boolean') pendingRegistrationApproval!: boolean;
    @attr('boolean') archiving!: boolean;
    @attr('boolean') embargoed!: boolean;
    @attr('date') embargoEndDate!: Date | null;
    @attr('boolean') pendingEmbargoApproval!: boolean;
    @attr('boolean') pendingEmbargoTerminationApproval!: boolean;
    @attr('boolean') withdrawn!: boolean;
    @attr('date') dateWithdrawn!: Date | null;
    @attr('fixstring') withdrawalJustification?: string;
    @attr('boolean') pendingWithdrawal!: boolean;
    @attr('fixstring') registrationSupplement?: string;
    @attr('fixstring') articleDoi!: string | null;
    @attr('object') registeredMeta!: RegistrationMetadata;
    @attr('registration-responses') registrationResponses!: RegistrationResponse;

    // Write-only attributes
    @attr('array') includedNodeIds?: string[];
    @attr('boolean') createDoi?: boolean;
    @attr('fixstring') draftRegistrationId?: string;

    @computed(
        'withdrawn', 'embargoed', 'public', 'pendingRegistrationApproval',
        'pendingEmbargoApproval', 'pendingEmbargoTerminationApproval',
        'pendingWithdrawal',
    )
    get state(): RegistrationState {
        const stateMap: any = this.registrationStateMap();
        const currentState: RegistrationState = Object.keys(stateMap)
            .filter(active => stateMap[active])
            .map(key => RegistrationState[key as keyof typeof RegistrationState])[0];

        return currentState || RegistrationState.Public;
    }

    @belongsTo('node', { inverse: 'registrations' })
    registeredFrom!: DS.PromiseObject<NodeModel> & NodeModel;

    @belongsTo('user', { inverse: null })
    registeredBy!: DS.PromiseObject<UserModel> & UserModel;

    @belongsTo('registration-provider', { inverse: 'registrations' })
    provider!: DS.PromiseObject<RegistrationProviderModel> & RegistrationProviderModel;

    @hasMany('contributor', { inverse: 'node' })
    contributors!: DS.PromiseManyArray<ContributorModel>;

    @hasMany('comment', { inverse: 'node' })
    comments!: DS.PromiseManyArray<CommentModel>;

    @belongsTo('registration-schema', { inverse: null })
    registrationSchema!: DS.PromiseObject<RegistrationSchemaModel> & RegistrationSchemaModel;

    @belongsTo('registration', { inverse: 'children' })
    parent!: DS.PromiseObject<RegistrationModel> & RegistrationModel;

    @belongsTo('registration', { inverse: null })
    root!: DS.PromiseObject<RegistrationModel> & RegistrationModel;

    @hasMany('registration', { inverse: 'parent' })
    children!: DS.PromiseManyArray<RegistrationModel>;

    @hasMany('institution', { inverse: 'registrations' })
    affiliatedInstitutions!: DS.PromiseManyArray<InstitutionModel> | InstitutionModel[];

    // Write-only relationships
    @belongsTo('draft-registration', { inverse: null })
    draftRegistration!: DraftRegistrationModel;

    registrationStateMap(): Record<RegistrationState, boolean> {
        const {
            pendingRegistrationApproval,
            pendingEmbargoApproval,
            pendingEmbargoTerminationApproval,
            pendingWithdrawal,
            withdrawn,
            embargoed,
        } = this;
        const embargo = embargoed && !pendingEmbargoTerminationApproval;

        return {
            PendingRegistration: pendingRegistrationApproval,
            PendingEmbargo: pendingEmbargoApproval,
            PendingEmbargoTermination: pendingEmbargoTerminationApproval,
            PendingWithdrawal: pendingWithdrawal,
            Withdrawn: withdrawn,
            Embargoed: embargo,
            Public: !pendingWithdrawal,
        };
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        registration: RegistrationModel;
    } // eslint-disable-line semi
}
