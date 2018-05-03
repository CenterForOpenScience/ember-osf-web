import DS from 'ember-data';
import fixSpecialChars from 'ember-osf-web/utils/fix-special-char';

const { StringTransform } = DS;

/**
 * @module ember-osf-web
 * @submodule transforms
 */

/**
 * Custom string field transform that uses the `fix-special-char` utility function to clean up malformed text sent
 * from the server. This allows string fields to be correctly and transparently used in templates without manually
 * fixing these characters for display on each use.
 *
 * This transform is used when `fixstring` is passed as the type parameter to the attr function.
 *  ```app/models/score.js
 *   import DS from 'ember-data';
 *   export default DS.Model.extend({
 *      astring: attr('fixstring'),
 *   });
 * ```
 * @class fixstring
 * @extends DS.StringTransform
 * @uses fix-special-char
 */
export default StringTransform.extend({
    deserialize(serialized: string): string {
        return fixSpecialChars(this._super(serialized) || '');
    },
});

declare module 'ember-data' {
  interface TransformRegistry {
      'fixstring': string;
  }
}
