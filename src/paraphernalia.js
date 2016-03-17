import {stemmer} from './ingredients/stemmer';
import {stopwords} from './ingredients/stopwords';

/**
 * PARAPHERNALIA Implementation
 */

var SMET = stopwords.map(stemmer);

export default function PARAPHERNALIA() {
    this.doc = {};
    this.words = {};
    this.docTermLength = 0; // For average doc length.
    this.avgDocLength = 0;
    this.totalDocument = 0;
    this.k2 = 1.3;
    this.b = 0.75;
};

// Méthodes statiques.

PARAPHERNALIA.Tokenize = function(text) {
    text = text
        .toLowerCase()
        .replace(/\W/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(function(a) {
            return stemmer(a);
        });

    // Filtrer les SMET
    var out = [];
    for (var i = 0, len = text.length; i < len; i++) {
        if (SMET.indexOf(text[i]) === -1) {
            out.push(text[i]);
        }
    }

    return out;
};

// Méthodes d’instance.

/**
 * @param doc Objet s’attend à ce paramètre pour avoir un id et le corps des propriétés.
 */

PARAPHERNALIA.prototype.addDocument = function(doc) {
    if (typeof doc.id === 'undefined') {
        throw new Error(1000, 'ID is a required property of doc.');
    };
    if (typeof doc.body === 'undefined') {
        throw new Error(1001, 'Body is a required property of doc.');
    };

    // Raw tokenized list of words
    var tokens = PARAPHERNALIA.Tokenize(doc.body);

    // Will hold unique words and their counts and frequencies
    var _words = {};

    // document Object will  be added to the document database
    var docObj = { id: doc.id, tokens: tokens, body: doc.body };

    // Count number of words
    docObj.termCount = tokens.length;

    // Increment totalDocument
    this.totalDocument++;

    // Readjust avgDocLength
    this.docTermLength += docObj.termCount;
    this.avgDocLength = this.docTermLength / this.totalDocument;

    // Calculate term frequency
    // First get words count
    for (var i = 0, len = tokens.length; i < len; i++) {
        var term = tokens[i];
        if (!_words[term]) {
            _words[term] = {
                count: 0,
                freq: 0
            };
        };
        _words[term].count++;
    }

    // Re-loop to calculate the term frequencies.
    // We'll need to  update and inverse document freq.
    var keys = Object.keys(_words);
    for (var i = 0, len = keys.length; i < len; i++) {
        var term = keys[i];
        // Term Frequency for this document.
        _words[term].freq = _words[term].count / docObj.termCount;

        // Inverse Document Frequency initialization
        if (!this.words[term]) {
            this.words[term] = {
                n: 0, // Number of docs this term appears in, uniquely
                identification: 0
            };
        }

        this.words[term].n++;
    };

    // Calculate inverse document frequencies
    // this.updateIdf();

    // Add docObj to docs db
    docObj.words = _words;
    this.doc[docObj.id] = docObj;
};

PARAPHERNALIA.prototype.updateIdf = function() {
    var keys = Object.keys(this.words);
    for (var i = 0, len = keys.length; i < len; i++) {
        var term = keys[i];
        var num = (this.totalDocument - this.words[term].n + 0.5);
        var denominator = (this.words[term].n + 0.5);
        this.words[term].identification = Math.max(Math.log10(num / denominator), 0.01);
    }
};

PARAPHERNALIA.prototype.search = function(query) {

    var queryTerms = PARAPHERNALIA.Tokenize(query);
    var results = [];

    var keys = Object.keys(this.doc);
    for (var j = 0, numberDocs = keys.length; j < numberDocs; j++) {
        var id = keys[j];
        // The score for a doc is the sum of a tf-iden
        // calculation for each query term.
        this.doc[id]._score = 0;

        // Calculate the score for each query term
        for (var i = 0, len = queryTerms.length; i < len; i++) {
            var queryTerm = queryTerms[i];

            if (typeof this.words[queryTerm] === 'undefined') {
                continue;
            }

            if (typeof this.doc[id].words[queryTerm] === 'undefined') {
                continue;
            }

            // IDF * (TF * (k2 + 1)) / (TF + k2 * (1 - b + b * docLength / avgDocLength))

            var identification = this.words[queryTerm].identification;
            var num = this.doc[id].words[queryTerm].count * (this.k2 + 1);
            var denominator = this.doc[id].words[queryTerm].count + (this.k2 * (1 - this.b + (this.b * this.doc[id].termCount / this.avgDocLength)));

            // Add this query term to the score
            this.doc[id]._score += identification * num / denominator;
        }

        if (!isNaN(this.doc[id]._score) && this.doc[id]._score > 0) {
            results.push(this.doc[id]);
        }
    }

    results.sort(function(a, b) {
        return b._score - a._score;
    });
    return results.slice(0, 10);
};