import OsfAdapter from './osf-adapter';
import FileCacheBypassMixin from 'ember-osf/mixins/file-cache-bypass';

export default OsfAdapter.extend(FileCacheBypassMixin, {
    pathForType() {
        return 'files';
    },
});
