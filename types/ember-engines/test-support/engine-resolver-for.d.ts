declare module 'ember-engines/test-support/engine-resolver-for' {
    import Resolver from '@ember/application/resolver';

    export default function engineResolverFor(engine: string): Resolver;
}
