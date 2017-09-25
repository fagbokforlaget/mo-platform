import axios from 'axios';

export default class MultiDictClient {
  constructor(baseUrl = 'https://dev-dict.fagbokforlaget.no/api/v1') {
    this.client = axios.create({
      'baseURL': baseUrl,
      'headers': {'X-Custom-Header': 'dict-client'},
      'timeout': 2000
    });
  }

  search(phrase, language, trans_lang, fallback_lang) {
    let params = {'phrase': phrase, 'language': language};
    if ( trans_lang ) { params['trans_lang'] = trans_lang; }
    if ( fallback_lang ) { params['fallback_lang'] = fallback_lang; }
    return this.client.get('/phrases/search', {'params': params});
  }

}
