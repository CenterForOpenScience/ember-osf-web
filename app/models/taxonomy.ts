import { attr } from '@ember-decorators/data';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

// TODO: API often represents subjects as SubjectRefs. Someday, when the API improves,
// it should be a relationship field.
export interface SubjectRef {
    id: string;
    text: string;
}

/**
 * Model for OSF APIv2 preprints. This model may be used with one of several API endpoints. It may be queried directly.
 * In the future, there will be multiple taxonomy endpoints under the same namespace.
 * @class Taxonomy
 */
export default class Taxonomy extends OsfModel {
    @attr('fixstring') text: string;
    @attr('string') shareTitle: string;
    @attr('string') path: string;
    @attr('number') childCount: number;
    @attr('object') parent: SubjectRef; // eslint-disable-line no-restricted-globals
}

declare module 'ember-data' {
    interface ModelRegistry {
        'taxonomy': Taxonomy;
    }
}
