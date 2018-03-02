import ResolvedGuidRoute from '../resolve-guid/resolved-guid-route';

export default class GuidRegistration extends ResolvedGuidRoute.extend({
}) {
    model(this: GuidRegistration, params: { registration_id: string }) {
        return {
            taskInstance: this.get('loadModel').perform('registration', params.registration_id),
            registrationId: params.registration_id,
        };
    }
}
