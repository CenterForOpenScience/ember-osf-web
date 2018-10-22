import { attr } from '@ember-decorators/data';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 citation styles
 *
 * @class Citation
 */
export default class Citation extends OsfModel {
    @attr('string') citation!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        citation: Citation;
    } // eslint-disable-line semi
}
