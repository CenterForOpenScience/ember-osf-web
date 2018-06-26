import collapseProto from '@ember-decorators/utils/collapse-proto';
import Component from '@ember/component';

function collapseAndMerge<T>(prototype: any, property: string, ...items: T[]): void {
    collapseProto(prototype);

    // eslint-disable-next-line no-param-reassign
    prototype[property] = [
        ...(prototype[property] || []),
        ...items,
    ];
}

export function localClassNames(...classNames: string[]) {
    return <T extends Newable<Component>>(klass: T) => {
        collapseAndMerge(klass.prototype, 'localClassNames', ...classNames);

        return klass;
    };
}

export function localClassName(target?: any, key?: string, descriptor?: PropertyDescriptor, params?: string[]): any {
    collapseAndMerge(
        target,
        'localClassNameBindings',
        params && params.length > 0 ? `${key}:${params.join(':')}` : key,
    );

    return descriptor;
}
