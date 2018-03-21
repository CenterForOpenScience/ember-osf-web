import Dropzone from 'dropzone';

export default class CustomDropzone extends Dropzone {
    drop(e) {
        if (CustomDropzone.options.preventMultipleFiles && e.dataTransfer) {
            if ((e.dataTransfer.items && e.dataTransfer.items.length > 1) || e.dataTransfer.files.length > 1) {
                this.emit('drop', e);
                this.emit('error', 'None', 'Cannot upload multiple files');
                return;
            }
            if (e.dataTransfer.files.length === 0) {
                this.emit('drop', e);
                this.emit('error', 'None', 'Cannot upload directories, applications, or packages');
                return;
            }
        }
        // @ts-ignore: Overriding private method
        return super.drop(e);
    }

    _addFilesFromDirectory(directory, path) {
        const tmpDirectory = directory;
        if (!CustomDropzone.options.acceptDirectories) {
            tmpDirectory.status = Dropzone.ERROR;
            this.emit('error', tmpDirectory, 'Cannot upload directories, applications, or packages');
            return;
        }
        // @ts-ignore: Overriding private method
        return super._addFilesFromDirectory(tmpDirectory, path);
    }
}
