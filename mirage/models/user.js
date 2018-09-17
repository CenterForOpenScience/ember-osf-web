import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
    nodes: hasMany('node'),
    contributors: hasMany('contributor'),
    // reigstrations: hasMany('registration'),
    quickfiles: hasMany('file'),
    institutions: hasMany('institution', { inverse: 'users' }),
    root: belongsTo('root', { inverse: 'currentUser' }),
});
