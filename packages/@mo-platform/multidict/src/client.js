import axios from 'axios';

export default class MultiDictClient {
  constructor(baseUrl = 'https://stage.multidict.fagbokforlaget.no/api/v2', timeout = 2000) {
    this.client = axios.create({
      'baseURL': baseUrl,
      'headers': {'X-Custom-Header': 'dict-client'},
      'timeout': timeout
    });
    this.bookTitle = undefined;
  }

  search(phrase, language, trans_lang, fallback_lang) {
    let params = {'phrase': phrase, 'language': language};
    if ( trans_lang ) { params['trans_lang'] = trans_lang; }
    if ( fallback_lang ) { params['fallback_lang'] = fallback_lang; }
    if ( this.bookTitle ) { params['source'] = this.bookTitle; }
    let self = this;
    return new Promise(function(resolve, reject) {
        self.client.get('/phrases/search', {'params': params})
        .then(function(response) {
            resolve( self._apply_dict_rules(response, phrase) );
        }, function(error) {
            reject(error);
        });
    });
  }

  _apply_dict_rules(response, phrase){
    phrase = phrase.toLowerCase();
    response.data = this._inflection_rule(response.data, phrase);
    response.data = this._baseform(response.data, phrase);
    return response;
  }

  _baseform(data, lookup_word){
    if (typeof(data) !== 'object' ){
      return;
    }
    data.forEach(function(el){
      let baseForm = el.phrase.props.idx;
      if (baseForm && lookup_word != baseForm) {
        el.phrase.base_form = baseForm;
      }
    });

    return data;
  }

  _inflection_rule(data, lookup_word){
    if (typeof(data) !== 'object' ){
      return;
    }
    data.forEach(function(el){
      let inflections = el.phrase.inflections;
      el.phrase.lookup_word_form = {};
      // Seperate inflections and auto inflections
      if (typeof(inflections) === 'object' ){

        let auto_inflections = [];
        let inf_by_form = {};

        inflections.forEach(function(inf, i){
          if ( inf.props.automatic || inf.props.type == 'extra'){
            auto_inflections.push(inf);
          }
          else {
            if ( inf.props.name == lookup_word ) {
              el.phrase.lookup_word_form = inf.form;
            }
            /*
              We need to find all inflection of same form and we need to keep the order too
              Lets create a object example
              ordered_inflection = {
                  form_id : [
                      order_no : { inflection object }
                  ]
              }
            */
            if (!inf_by_form[inf.form.id]){
              inf_by_form[inf.form.id] = [];
            }
            let order_no = inf.props.order || 0;
            inf_by_form[inf.form.id][order_no] = inf;
          }
        });

        let phrase_inflections = [];
        /*
          Combine same form inflections
          check for same form.id and props.order for right order
        */
        Object.keys(inf_by_form).forEach(function (key) {
          let value = inf_by_form[key];
          let inf   = value[0];
          inf.props.name = value.map(function(ks){
            return ks.props.name;
          }).join('/');
          phrase_inflections.push(inf);
        });

        el.phrase.inflections = phrase_inflections;
        el.phrase.auto_inflections = auto_inflections;
      }
    });
    return data;
  }

}
