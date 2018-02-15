import OsfAdapter from './osf-adapter';
import FileCacheBypassMixin from 'ember-osf-web/mixins/file-cache-bypass';

export default OsfAdapter.extend(FileCacheBypassMixin, {
    pathForType() {
        return 'files';
    },
});
