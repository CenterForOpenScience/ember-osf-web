import collapseProto from '@ember-decorators/utils/collapse-proto';
import { decoratorWithParams } from '@ember-decorators/utils/decorator';
import Component from '@ember/component';
import { assert } from '@ember/debug';

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

export const localClassName = decoratorWithParams(
    (target: any, key: string, descriptor: PropertyDescriptor, params: string[]) => {
        /* eslint-disable max-len */
        /* tslint:disable:max-line-length */
        assert(`The @localClassName decorator may take up to two parameters, the truthy class and falsy class for the class binding. Received: ${params.length}`, params.length <= 2);
        assert(`The @localClassName decorator may only receive strings as parameters. Received: ${params}`, params.every(s => typeof s === 'string'));
        /* tslint:enable:max-line-length */
        /* eslint-enable max-len */

        collapseAndMerge(
            target,
            'localClassNameBindings',
            params && params.length > 0 ? `${key}:${params.join(':')}` : key,
        );

        return descriptor;
    },
);
