/* tslint:disable */
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

        interface EmberLocation {
            implementation: string;

            getURL(): string;
            setURL(path: string): void;
            replaceURL(path: string): void;
            // onUpdateURL()
            formatURL(url: string): string;
            detect(): void;
        }

        interface AutoLocation extends EmberLocation { }
        interface NoneLocation extends EmberLocation { }
    }
}

declare module '@ember/routing/transition' {
    import Ember from 'ember';

    interface AbstractHandlerInfo {
        isResolved: boolean;
        name: string;
        params?: Record<string, string>;
    }

    interface HandlerInfo extends AbstractHandlerInfo {
        isResolved: true;
    }

    interface UnresolvedHandlerInfo extends AbstractHandlerInfo {
        isResolved: false;
    }

    export default interface Transition extends Ember.Transition {
        params: Record<string, Record<string, string>>;
        handlerInfos: Array<HandlerInfo | UnresolvedHandlerInfo>;
        resolvedModels: Record<string, any>;
        queryParams?: Record<string, any>;
    } // eslint-disable-line semi
}
