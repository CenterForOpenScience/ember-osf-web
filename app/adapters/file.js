import OsfAdapter from './osf-adapter';
import FileCacheBypassMixin from 'ember-osf/mixins/file-cache-bypass';

export default OsfAdapter.extend(FileCacheBypassMixin, {
    buildURL(modelName, id, snapshot, requestType) {
        const url = this._super(...arguments);
        if (requestType === 'deleteRecord') {
            // Water Bulter API does not like trailing slashes.
            return url.replace(/\/$/, '');
        }
        return url;
    },
});
