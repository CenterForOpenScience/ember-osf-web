import ComputedProperty from '@ember/object/computed';
import { Service as IntlService } from 'ember-intl';

/* tslint:disable:variable-name */
export const __intlInjectionName: string;
/* tslint:enable:variable-name */

type GetterFn<Ctx> = (
    this: Ctx,
    intl: IntlService,
    propertyKey: string,
    ctx: Ctx,
) => string;

export default function intl(
    ...dependentKeysAndGetterFn: Array<string | GetterFn<object>>
): ComputedProperty<() => ReturnType<GetterFn<object>>>;
