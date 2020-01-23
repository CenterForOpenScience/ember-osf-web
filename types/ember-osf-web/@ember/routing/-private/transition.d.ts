import Transition from '@ember/routing/-private/transition';

declare module '@ember/routing/-private/transition' {
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

    export default interface Transition {
        routeInfos: Array<HandlerInfo | UnresolvedHandlerInfo>;
        queryParamsOnly: boolean;
        resolvedModels: Record<string, any>;
        sequence: number;
        targetName: string;
        router: {
            generate(handlerName: string, ...params: any[]): string;
        };
        [index: string]: {};
    } // eslint-disable-line semi
}
