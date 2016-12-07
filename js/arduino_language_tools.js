// var arduinoCompleter = {
//     getCompletions: function(editor, session, pos, prefix, callback) {
//         if (prefix.length === 0) { callback(null, []); return }
//         $.getJSON(
//             "http://rhymebrain.com/talk?function=getRhymes&word=" + prefix,
//             function(wordList) {
//                 // wordList like [{"word":"flow","freq":24,"score":300,"flags":"bc","syllables":"1"}]
//                 callback(null, wordList.map(function(ea) {
//                     return {name: ea.word, value: ea.word, score: ea.score, meta: "rhyme"}
//                 }));
//             })
//     }
// };

var arduinoCompleter = {
    // getCompletions: function (editor, session, pos, prefix, callback) {
    //     if (prefix.length === 0) {
    //         callback(null, []);
    //         return
    //     }
    //     // check if in arduinoLang
    //     for(var i = 0; i < arduinoLang.length; i++){
    //         if(arduinoLang[i].word = prefix){
    //
    //         }
    //     }
    //     // wordList like [{"word":"flow","freq":24,"score":300,"flags":"bc","syllables":"1"}]
    //     callback(null, wordList.map(function (ea) {
    //         return {name: ea.word, value: ea.word, score: ea.score, meta: "rhyme"}
    //     }));
    // }

        getCompletions: function(editor, session, pos, prefix, callback) {
            var wordList = ["Serial", "print", "println"];
            callback(null, arduinoLang.map(function (word) {
                return {
                    caption: word,
                    value: word,
                    score:1000 + parseInt(arduinoLang.indexOf(word)),
                    meta: "Arduino"
                };
            }));

        }
};

var arduinoLang = [
    // 'setup()',
    // 'loop()',
    // 'HIGH',
    // 'LOW',
    // 'INPUT',
    // 'OUTPUT',
    // 'INPUT_PULLUP',
    // 'LED_BUILTIN',
    // 'PROGMEM',
    // 'millis()',
    // 'micros()',
    // 'delay',
    // 'delayMicroseconds',
    // 'Serial',
    // 'Serial',
    // 'available()',
    // 'availableForWrite()',
    // 'begin()',
    // 'end()',
    // 'find()',
    // 'findUntil()',
    // 'flush()',
    // 'parseFloat()',
    // 'parseInt()',
    // 'peek()',
    // 'print'
];