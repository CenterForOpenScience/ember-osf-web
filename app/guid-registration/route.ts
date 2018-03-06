import ResolvedGuidRoute from '../resolve-guid/resolved-guid-route';

export default class GuidRegistration extends ResolvedGuidRoute.extend({
}) {
    model(this: GuidRegistration, params: { registration_guid: string }) {
        return {
            taskInstance: this.get('loadModel').perform('registration', params.registration_guid),
            registrationId: params.registration_guid,
        };
    }
}
