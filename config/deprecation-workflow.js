self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
    workflow: [
        { handler: 'silence', matchId: 'ember.globals-resolver' },
        { handler: 'silence', matchId: 'ember-inflector.globals' },
        { handler: 'silence', matchId: 'ember-metal.get-with-default' },
        { handler: 'silence', matchId: 'computed-property.volatile' },
        { handler: 'silence', matchId: 'implicit-injections' },
        { handler: 'silence', matchId: 'manager-capabilities.modifiers-3-13' },
        { handler: 'silence', matchId: 'this-property-fallback' },
        { handler: 'silence', matchId: 'ember-glimmer.link-to.positional-arguments' },
        { handler: 'silence', matchId: 'ember-views.curly-components.jquery-element' },
        { handler: 'silence', matchId: 'ember-runtime.deprecate-copy-copyable' },
        { handler: 'silence', matchId: 'ember-bootstrap.subclassing#Alert' },
        { handler: 'silence', matchId: 'routing.transition-methods' },
        { handler: 'silence', matchId: 'autotracking.mutation-after-consumption' },
        { handler: 'silence', matchId: 'computed-property.override' },
        { handler: 'silence', matchId: 'ember-utils.try-invoke' },
        { handler: 'silence', matchId: 'ember-engines.deprecation-camelized-engine-names' },
        { handler: 'silence', matchId: 'ember-data:legacy-test-helper-support' },
        { handler: 'silence', matchId: 'has-block-and-has-block-params' },
    ],
};
