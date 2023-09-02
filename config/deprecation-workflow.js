self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
    workflow: [
        { handler: 'silence', matchId: 'routing.transition-methods' },
        { handler: 'silence', matchId: 'ember-utils.try-invoke' },
        { handler: 'silence', matchId: 'ember-simple-auth.initializer.setup-session-restoration' },
        { handler: 'silence', matchId: 'ember-simple-auth.events.session-service' },
        { handler: 'silence', matchId: 'ember-cli-mirage.miragejs.import' },
        { handler: 'silence', matchId: 'ember-cli-mirage-config-routes-only-export' },
        { handler: 'silence', matchId: 'ember-engines.deprecation-router-service-from-host'},
        { handler: 'silence', matchId: 'ember-test-waiters-legacy-module-name'},
        { handler: 'silence', matchId: 'deprecated-run-loop-and-computed-dot-access'},
        { handler: 'silence', matchId: 'ember.built-in-components.legacy-attribute-arguments'},
        { handler: 'silence', matchId: 'ember.built-in-components.reopen'},
        { handler: 'silence', matchId: 'ember.component.reopen'},
        { handler: 'silence', matchId: 'ember-global'},
        { handler: 'silence', matchId: 'ember.link-to.disabled-when'},
        { handler: 'silence', matchId: 'route-disconnect-outlet'},
        { handler: 'silence', matchId: 'template-compiler.registerPlugin'},
        { handler: 'silence', matchId: 'setting-on-hash'},
    ],
};
