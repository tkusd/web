const REGEX_ASSET = /^asset:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;

export function extractAssetID(url){
  if (REGEX_ASSET.test(url)){
    return url.match(REGEX_ASSET)[1];
  }
}
