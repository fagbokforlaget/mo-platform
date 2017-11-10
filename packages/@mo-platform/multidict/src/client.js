import axios from 'axios';

export default class MultiDictClient {
  constructor(baseUrl = 'https://dev-dict.fagbokforlaget.no/api/v2') {
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
    let self = this;
    return new Promise(function(resolve, reject) {
        self.client.get('/phrases/search', {'params': params})
        .then(function(response) {
            resolve( self._apply_dict_rules(response) );
        }, function(error) {
            reject(error);
        });
    });
  }

  _apply_dict_rules(response){
    response.data = this._inflection_rule(response.data);
    return response;
  }

  _inflection_rule(data){
    if (typeof(data) !== 'object' ){
      return;
    }
    data.forEach(function(el){
      let inflections = el.phrase.inflections;
      // Seperate inflections and auto inflections
      if (typeof(inflections) === 'object' ){

        let auto_inflections = [];
        let inf_by_form = {};

        inflections.forEach(function(inf, i){
          if (inf.props.automatic){
            auto_inflections.push(inf);
          }
          else {
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
