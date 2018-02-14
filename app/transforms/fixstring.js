import DS from 'ember-data';

import fixSpecialChars from '../utils/fix-special-char';

/**
 * @module ember-osf
 * @submodule transforms
 */

/**
  Custom string field transform that uses the `fix-special-char` utility function to clean up malformed text sent
  from the server. This allows string fields to be correctly and transparently used in templates without manually fixing
  these characters for display on each use.

   This transform is used when `fixstring` is passed as the type parameter to the DS.attr function.
    ```app/models/score.js
     import DS from 'ember-data';
     export default DS.Model.extend({
        astring: DS.attr('fixstring'),
     });
   ```
  @class fixstring
  @extends DS.StringTransform
  @uses fix-special-char
 */
export default DS.StringTransform.extend({
    deserialize(serialized) {
        return fixSpecialChars(this._super(serialized));
    },
});
