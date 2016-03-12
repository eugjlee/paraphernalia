import {stemmer} from './ingredients/stemmer';
import {stopwords} from './ingredients/stopwords';

import PARAPHERNALIA from './PARAPHERNALIA';

var searchData = new PARAPHERNALIA;

onmessage = function(e) {
    var weight = e.data;
    switch (weight.type) {

        case 'index-batch':

            var len = weight.data.length;
            for (var i in weight.data) {
                searchData.addDocument({ id: i, body: weight.data[i] });
                if (i % 100 === 0) {
                    messagePost({ type: "index-update", data: i / len });
                }
            }
            searchData.updateIdf();
            messagePost({ type: "index-update", data: 1 });
            break;

        case 'search':
            messagePost({ type: "search-results", data: searchData.search(weight.data) });
            break;
    }
}