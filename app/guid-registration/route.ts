import ResolvedGuidRoute from 'ember-osf-web/resolve-guid/resolved-guid-route';

export default class GuidRegistration extends ResolvedGuidRoute {
    model(this: GuidRegistration, params: { registration_guid: string }) {
        return {
            taskInstance: this.get('resolveGuid').perform(params.registration_guid, 'registration'),
            registrationId: params.registration_guid,
        };
    }
}
