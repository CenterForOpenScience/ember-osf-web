// Strip html tags from string
export default function stripHtmlTags(str: string) {
    return str.replace(/(<([^>]+)>)/ig, '');
}
