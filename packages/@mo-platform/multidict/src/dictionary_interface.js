/*
 * Dictionary interface
 * Copyright (c) 2015 Fagbokforlaget.no | Rakesh Kumar Shardiwal, Waldemar Mazurek
*/

dictionary_interface = (function (){
    function dictionary (conf) {
        this.tts_server     = 'https://dbok.portfolio.no/';
        this.language       = conf.language;
        this.trans_lang     = conf.trans_lang;
        this.fallback_lang  = conf.fallback_lang;

        this.init = function () {
        };

        this.on_error = function () {
        };

        this.search = function (query, callback) {
            var self = this,
                prepare_data;

            if (!self.language && !self.trans_lang) {
                return;
            }

            prepare_data = function (data, phrase, language) {
                if (!data || data.length < 1) {
                    callback(
                        $('<div/>', {
                            'class': 'no-data'
                        })
                        .html('Not found - use external resources.'),
                        query
                    );
                } else {
                    callback(
                        self.presentData(data, phrase, language),
                        query
                    );
                }
            };

            self.get_phrase(query, prepare_data);
        };

        this.get_phrase = function (phrase, callback) {
            var self = this,
                language = self.language,
                trans_lang = self.trans_lang,
                fallback_lang = self.fallback_lang,
                displayError,
                defaultCallback,
                dict = new MultiDictClient();

            displayError = function () {
                throw 'Error';
                return;
            };

            defaultCallback = function (data) {
                if (!data) {
                    displayError();
                } else {
                    if (typeof (callback) === 'function') {
                        callback(data, phrase, language);
                    }
                }
            };

            dict
            .search(phrase, language, trans_lang, fallback_lang)
            .then( function(data) {
                defaultCallback(data.data, phrase, language );
            });

        };

        this.presentPhrase = function (obj, selectedWord, form) {
            var self = this,
            response_obj = obj,
            $outHtml = $('<div/>', {'class': 'dictionary'});

            obj = obj.phrase;

            var wordClass,
                wordInflections = obj.inflections,
                baseForm        = obj.base_form,
                wordExplanation = obj.props.explanation,
                wordSynonyms    = obj.synonyms,
                wordSpelling    = obj.alternative_spellings,
                wordGender      = obj.gender ? obj.gender.props.name : '',
                translatedWord  = '',
                auto_inflection = '',
                inflections     = [],
                conjugations    = '',
                base_conjugations = '',
                $hiddenHtml;

            wordClass   = obj.wordclass.props.name || 'Frase';
            wordClass   = wordClass.replace(',', ', ');
            translation = response_obj.translation || response_obj.fallback_translation;

            if (translation) {
                translatedWord = translatedWord + translation.props.name + ', ';
            }

            $.each(wordInflections, function (index, conj) {
                var name = conj.props.name;
                if ( conj.props.automatic ) {
                    auto_inflection += name + ', ';
                    base_conjugations  += conj.form.props.name + ' or '
                }
                else {
                    inflections.push(name);
                    conjugations  += conj.form.props.name + ' or '
                }
            });

            if (selectedWord) {
                $outHtml.append(
                    $('<p/>', {
                        'class': 'selected-word',
                        'data-word': selectedWord
                    })
                    .html(selectedWord)
                    //.prepend(self.embedAudio(selectedWord))
                    //.prepend(self.soundIcon(selectedWord))
                );
            }

            if (baseForm) {
                $outHtml.append(
                    $('<p/>', {
                        'class': 'basic-form lang-info'
                    })
                    .html(baseForm)
                    .prepend(
                        $('<span/>').text('Base form:')
                    )
                );
            }

            if (!translation) {
                $outHtml.append(
                    $('<p/>', {
                        'class': 'no-translation lang-info'
                    })
                    .html(
                        'No translation found - use external resources.'
                    )
                );
            }

            if (translatedWord) {
                $outHtml.append(
                    $('<p/>', {
                        'class': 'name'
                    })
                    .html(translatedWord + ' ')
                );
            }

            if (wordExplanation) {
                $outHtml.append(
                    $('<p/>', {
                        'class': 'explanation lang-info'
                    })
                    .html(wordExplanation)
                );
            }

            if (wordClass) {

                $hiddenHtml = $('<div/>', {
                    'class': 'hidden-content'
                });

                $hiddenHtml.append(
                    $('<p/>', {
                        'class': 'speech lang-info'
                    })
                    .html(wordClass)
                    .prepend(
                        $('<span/>').text('Word class:')
                    )
                );

                $outHtml.append($hiddenHtml);
            }

            if (wordInflections.length > 0) {

                $hiddenHtml.append(
                    $('<p/>', {
                        'class': 'grammatical-form lang-info'
                    })
                    .html(obj.form.props.name)
                    .prepend(
                        $('<span/>').text('Form:')
                    )
                );

                if (wordInflections.length > 0) {
                    $hiddenHtml.append(
                        $('<p/>', {
                            'class': 'inflection lang-info'
                        })
                        .html(inflections.join(', '))
                        .prepend(
                            $('<span/>').text('Inflection:')
                        )
                    );
                }

                if (wordSynonyms && wordSynonyms.length > 0) {
                    var $synonyms = $('<span class="synonym-list"/>'),
                        i;

                    for (i = 0; i < wordSynonyms.length; i += 1) {
                        var $item = $('<span/>'),
                            $synonym = $('<i/>'),
                            synonym_id = wordSynonyms[i].id,
                            synonym_name = wordSynonyms[i].name;

                        if (i !== 0) {
                            $item.text(', ');
                        }

                        $synonym.attr('data-id', synonym_id).text(synonym_name).appendTo($item);
                        $synonyms.append($item);
                    }

                    $hiddenHtml.append(
                        $('<p/>', {
                            'class': 'synonyms lang-info'
                        })
                        .html($synonyms)
                        .prepend(
                            $('<span/>').text('Synonyms:')
                        )
                    ).find('.synonym-list').on('click', 'i', function () {
                        var $self = $(this),
                            item_id = $self.attr('data-id'),
                            item_name = $self.text();

                        $self.closest('.define_').find('.buttonpane button').trigger('click');
                        $('.sodefine a').trigger('click', [item_name])
                    });
                }

                if (wordSpelling && wordSpelling.props) {
                    $hiddenHtml.append(
                        $('<p/>', {
                            'class': 'spelling lang-info'
                        })
                        .html(wordSpelling.props.name)
                        .prepend(
                            $('<span/>').text('Alternative spelling:')
                        )
                    );
                }

                $outHtml.append($hiddenHtml);
            }

            return $outHtml;
        };

        this.soundIcon = function (sound_word) {
            var self = this,
                $icon,
                hide_sound_icon = 0,
                http_handler = new XMLHttpRequest(),
                sound_url = self.soundUrl(sound_word);

            $icon = $('<span/>', {
                'class': 'play-audio'
            })
            .on('click', function (e) {
                $audio = $(this).closest('.selected-word').find('audio');
                $audio.trigger('play');
            })
            .html('<svg version="1.1" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="-269.5 386.7 26.9 23.4" enable-background="new -269.5 386.7 26.9 23.4" xml:space="preserve"><g transform="translate(0,-1002.3622)"><path fill="#363636" d="M-255.8 1389.1l-8.4 6.9c-1.5 0-3.6 0-5.3 0v9.7h5.4l8.2 6.8L-255.8 1389.1zM-254.1 1396.9l1.6-1.3c2.7 2.8 2.6 7.2-0.1 10.3l-1.5-1.3C-252.1 1402.1-251.5 1399.7-254.1 1396.9L-254.1 1396.9zM-251 1394.3l1.6-1.3c4.1 4.6 3.9 10.6-0.2 15.8l-1.5-1.3C-247.7 1402.4-247.3 1399-251 1394.3L-251 1394.3zM-248.2 1392.2l1.6-1.3c5.5 5.4 5.4 13.9-0.4 20.3l-1.5-1.3C-243.6 1403.6-243.5 1397.7-248.2 1392.2L-248.2 1392.2z"/></g></svg>')
            .hide();

            http_handler.open('HEAD', sound_url);
            http_handler.onreadystatechange = function () {
                if (this.readyState == 2) {
                    hide_sound_icon = 1;
                }

                if ( !hide_sound_icon ) {
                    $icon.show();
                }
            };
            http_handler.send()

            return $icon;
        }

        this.soundUrl = function (sound_word) {
            var self = this,
                word;

            // remove punctuation from word
            word = sound_word.replace(/((&\w+;|[-\/+*=?:.,;()\[\]{}|%^!])+)/g, '');
            word = encodeURIComponent($.trim(word.toLowerCase()));

            return self.tts_server + 'talkbook/' + self.baseLang + '/' + word;
        }

        this.embedAudio = function (sound_word) {
            var self = this,
                sound_url = self.soundUrl(sound_word),
                audio

            audio = $('<audio/>', {
                'controls': false,
                'autoplay': false,
                'name': 'media'
            })
            .append(
                $('<source/>', {
                    'src': sound_url,
                    'type': 'audio/mpeg'
                })
            );

            return audio;
        }

        this.presentData = function (data, phrase, fallback) {
            var self = this,
                form = '',
                formData = [],
                $outHtml = $('<div/>');

            $.each(data, function (index, obj) {
                $outHtml.append(self.presentPhrase(obj, phrase, obj.form));
            });

            return $outHtml;
        };
    }

    return dictionary;
}());
