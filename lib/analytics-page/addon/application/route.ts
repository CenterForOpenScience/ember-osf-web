import Route from '@ember/routing/route';

export default class AnalyticsPageRoute extends Route {
    model(_: object, transition: any) {
        // HACK: another approach to modelFor that pierces the engine's isolation
        return transition.resolvedModels['guid-node'];
    }
}
