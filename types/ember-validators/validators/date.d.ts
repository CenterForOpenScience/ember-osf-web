import EmberObject from '@ember/object';
import DS from 'ember-data';
import ModelRegistry from 'ember-data/types/registries/model';
import { validateResult } from 'ember-validators';

import { ValidatedModelName } from 'ember-osf-web/models/osf-model';

export enum DatePrecision {
    Year = 'year',
    Month = 'month',
    Week = 'week',
    Day = 'day',
    Hour = 'hour',
    Minute = 'minute',
    Second = 'second',
}

export interface DateOptions {
    allowBlank?: boolean;
    before?: string;
    onOrBefore?: string;
    after?: string;
    onOrAfter?: string;
    precision?: DatePrecision;
    format?: string; // TODO: make an enum with API acceptible date formats
    errorFormat?: string;
}
export class Date<M extends ValidatedModelName> extends EmberObject {
    validate(
        value: any,
        options: DateOptions,
        model: ModelRegistry<M>,
        attributes: string,
    ): validateResult | Promise<validateResult>;
}
