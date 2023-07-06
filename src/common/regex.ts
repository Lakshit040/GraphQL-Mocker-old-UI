const CONDITION_REGEX = /(\([^()]+\))|[^&|]+/g;
const OBJECT_REGEX = /(==|!=|===|!==)\s*({.*})/;
const ARRAY_REGEX = /(==|===|!=|!==)\s*(\[.*])/;

export {CONDITION_REGEX, OBJECT_REGEX, ARRAY_REGEX};