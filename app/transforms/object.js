import $ from 'jquery';
import DS from 'ember-data';

export default DS.Transform.extend({
    deserialize(value) {
        if ($.isPlainObject(value)) {
            return value;
        }
        return {};
    },

    serialize(value) {
        if ($.isPlainObject(value)) {
            return value;
        }
        return {};
    },
});
