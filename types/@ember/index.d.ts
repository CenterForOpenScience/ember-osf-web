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

declare module '@ember/routing/transition' {
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
