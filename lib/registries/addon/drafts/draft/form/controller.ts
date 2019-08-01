import Controller from '@ember/controller';

export default class FormController extends Controller {
    queryParams = ['page'];
    page = 1;
    pageIndex = -1; // the index of the schema-block element with the current page-heading
    pageIndices = []; // an array of all of the page-heading elements indices
    schemaLength = 0;
    startIndex = 0;
    endIndex = 0;

    setBreaks() {
        const page = String(this.page);
        const model = this.get('model');
        const blocks = model.formBlocks;
        let startIndexLoc = 0;
        this.set('schemaLength', blocks.length);
        const breaks = [];
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (block.blockType === 'page-heading') {
                breaks.push(i);
                if (block.blockId === page) {
                    this.set('pageIndex', i);
                    this.set('startIndex', i - 1);
                    startIndexLoc = breaks.length - 1;
                }
            }
        }
        if (startIndexLoc === breaks.length - 1) {
            this.set('endIndex', blocks.length);
        } else {
            this.set('endIndex', breaks[startIndexLoc + 1]);
        }
        this.set('pageIndices', breaks);
        return breaks;
    }
}
