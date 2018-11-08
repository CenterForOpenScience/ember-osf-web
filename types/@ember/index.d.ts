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
            onUpdateURL(callback: (url: string) => void): void;
            formatURL(url: string): string;
            detect(): void;
        }

        interface AutoLocation extends EmberLocation { }
        interface NoneLocation extends EmberLocation { }
        interface HistoryLocation extends EmberLocation {
            history: any;
            location: Location;
            _previousURL: string; // tslint:disable-line:variable-name
            _popstateHandler?: () => void; // tslint:disable-line:variable-name
            _removeEventListener: () => void; // tslint:disable-line:variable-name
        }
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

    interface TransitionState {
        queryParams: Record<string, any>;
    }

    export default interface Transition extends Ember.Transition {
        handlerInfos: Array<HandlerInfo | UnresolvedHandlerInfo>;
        params: Record<string, Record<string, string>>;
        queryParams?: Record<string, any>;
        resolvedModels: Record<string, any>;
        state: TransitionState;
        targetName: string;
        router: {
            generate(handlerName: string, ...params: any[]): string;
        }
    } // eslint-disable-line semi
}
