/* tslint:disable */
import Ember from 'ember';

declare module 'ember' {
    export namespace Ember {
        interface EngineInstance {
            buildChildEngineInstance(string: name, options: {
                routable: boolean;
                mountPoint: string;
            }): EngineInstance;
        }

        interface _RegistryProxyMixin {
            register<T>(fullName: string, factory: T, options: { singleton?: boolean, instantiate: false }): any;
        }
    }
}
