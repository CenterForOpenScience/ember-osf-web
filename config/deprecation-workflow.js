self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
    workflow: [
        { handler: 'silence', matchId: 'manager-capabilities.modifiers-3-13' },
        { handler: 'silence', matchId: 'this-property-fallback' },
        { handler: 'silence', matchId: 'ember-bootstrap.subclassing#Alert' },
        { handler: 'silence', matchId: 'routing.transition-methods' },
        { handler: 'silence', matchId: 'ember-utils.try-invoke' },
        { handler: 'silence', matchId: 'has-block-and-has-block-params' },
        { handler: 'silence', matchId: 'ember-simple-auth.initializer.setup-session-restoration' },
        { handler: 'silence', matchId: 'ember-simple-auth.events.session-service' },
        { handler: 'silence', matchId: 'ember-cli-mirage.miragejs.import' },
        { handler: 'silence', matchId: 'ember-cli-mirage-config-routes-only-export' },
        { handler: 'silence', matchId: 'ember-engines.deprecation-router-service-from-host'},
        { handler: 'silence', matchId: 'ember-test-waiters-legacy-module-name'},
    ],
};
