import { attr, hasMany } from '@ember-decorators/data';
import DS from 'ember-data';

import LicenseModel from './license';
import OsfModel from './osf-model';
import TaxonomyModel from './taxonomy';

/* eslint-disable camelcase */

export interface Assets {
    favicon: string;
    powered_by_share: string;
    sharing: string;
    square_color_no_transparent: string;
    square_color_transparent: string;
    style: string;
    wide_black: string;
    wide_color: string;
    wide_white: string;
}

/* eslint-enable camelcase */

export default abstract class ProviderModel extends OsfModel {
    @attr('fixstring') name!: string;
    @attr('fixstring') description!: string;
    @attr('string') advisoryBoard!: string;
    @attr('fixstring') example!: string;
    @attr('string') domain!: string;
    @attr('boolean') domainRedirectEnabled!: boolean;
    @attr('fixstring') footerLinks!: string;
    @attr('fixstring') emailSupport!: string;
    @attr('string') facebookAppId!: string;
    @attr('boolean') allowSubmissions!: boolean;
    @attr('boolean') allowCommenting!: boolean;
    @attr() assets?: Partial<Assets>; // TODO: camelize in transform

    @hasMany('taxonomy')
    taxonomies!: DS.PromiseManyArray<TaxonomyModel>;

    @hasMany('taxonomy')
    highlightedTaxonomies!: DS.PromiseManyArray<TaxonomyModel>;

    @hasMany('license', { inverse: null })
    licensesAcceptable!: DS.PromiseManyArray<LicenseModel>;
}
