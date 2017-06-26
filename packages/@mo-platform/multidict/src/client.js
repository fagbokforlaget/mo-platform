import axios from 'axios';

export default class MultiDictClient {
  constructor(baseUrl = 'https://dev-dict.fagbokforlaget.no/api/v1') {
    this.client = axios.create({
      'baseURL': baseUrl,
      'headers': {'X-Custom-Header': 'dict-client'},
      'timeout': 2000
    });
  }

  search(phrase, language) {
    return this.client.get('/phrases/search', {'params':{'phrase': phrase, 'language': language}});
  }

}
