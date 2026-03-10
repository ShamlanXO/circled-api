import Fuse from 'fuse.js'
export const searchItemByKey=(array, keys, value)=> {
    const fuse = new Fuse(array, { keys: keys ,threshold:0.3,minMatchCharLength:2});
    const result = fuse.search(value);
    return result.length > 0 ? result.map(i=>i.item) : [];
}