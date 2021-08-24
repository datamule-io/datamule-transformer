import { dmt } from '../src/index.js'
import chai from 'chai';
import { round } from '../src/numeric-methods.js';
const assert = chai.assert;
const expect = chai.expect;

describe('join', function() {
    it('should return joined array with separator as single string', function() {
        const data = ['a','b','c','d'];
        const rules = [ ['join', ','] ]
        assert.deepEqual(
            dmt.applyRules(data, rules),
            'a,b,c,d'
        );
    });
});

describe('selectAll', function() {
    it('should return all results from selected jsonpath query', function() {
        const data = [
            { name: "London", "population": 8615246 },
            { name: "Berlin", "population": 3517424 },
            { name: "Madrid", "population": 3165235 },
            { name: "Rome",   "population": 2870528 }
        ];
        const rules = [ ['selectAll', '$..name'] ];
        expect(
            dmt.applyRules(data, rules),
        ).to.eql([ "London", "Berlin", "Madrid", "Rome" ])
    });
});

describe('cumsum', function() {
    it('should return cummulative sum of an array, treating non-numbers as 0', function() {
        const data = [10, 20, NaN, 100, undefined, 40, "hello"];
        const rules = [ 'cumsum' ];
        expect(
            dmt.applyRules(data, rules)
        ).to.eql(
            [10, 30, 30, 130, 130, 170, 170]
        );
    });
});

describe('fcumsum', function() {
    it('should return full precision cummulative sum of an array, treating non-numbers as 0', function() {
        const data = [1, 1e-14, -1];
        const rules = [ 'fcumsum' ];
        expect(
            dmt.applyRules(data, rules)
        ).to.eql(
            [1, 1.00000000000001, 1e-14]
        );
    });
});

describe('Aggregations', function() {
    describe('min', function () {
        it('should return minimum value from array', function () {
            const data = [4, 1, 6, 22];
            const rules = ['min'];
            assert.equal(
                dmt.applyRules(data, rules),
                1
            );
        });
    });

    describe('max', function () {
        it('should return minimum value from array', function () {
            const data = [4, 1, 6, 22];
            const rules = ['max'];
            assert.equal(
                dmt.applyRules(data, rules),
                22
            );
        });
    });

    describe('extent', function () {
        it('should return [minimum, maximum] values from array', function () {
            const data = [4, 1, 6, 22];
            const rules = ['extent'];
            expect(dmt.applyRules(data, rules)).to.eql([1, 22]);
        });
    });

    describe('minIndex', function () {
        it('should return index of minimum value in an array', function () {
            const data = [4, 1, 6, 22];
            const rules = ['minIndex'];
            assert.equal(
                dmt.applyRules(data, rules),
                1
            );
        });
    });

    describe('maxIndex', function () {
        it('should return index of maximum value in an array', function () {
            const data = [4, 1, 6, 22];
            const rules = ['maxIndex'];
            assert.equal(
                dmt.applyRules(data, rules),
                3
            );
        });
    });

    describe('length', function () {
        it('should return length of array', function () {
            const data = [4, 1, 6, 22];
            const rules = ['length'];
            assert.equal(
                dmt.applyRules(data, rules),
                4
            );
        });
    });

    describe('length of non-array', function () {
        it('should return undefined if called for non-array', function () {
            const data = {}
            const rules = ['length'];
            assert.equal(
                dmt.applyRules(data, rules),
                undefined
            );
        });
    });

    describe('sum', function () {
        it('should return sum of array, ignoring non-numbers', function () {
            const data = [4, 1, NaN, 6, undefined, 22, "hello"];
            const rules = ['sum'];
            assert.equal(
                dmt.applyRules(data, rules),
                33
            );
        });
    });

    describe('mean', function () {
        it('should return average of array, ignoring non-numbers', function () {
            const data = [10, 20, NaN, 30, undefined, 40, "hello"];
            const rules = ['mean'];
            assert.equal(
                dmt.applyRules(data, rules),
                25
            );
        });
    });

    describe('median', function () {
        it('should return median of array, ignoring non-numbers', function () {
            const data = [10, 20, NaN, 100, undefined, 40, "hello"];
            const rules = ['median'];
            assert.equal(
                dmt.applyRules(data, rules),
                30
            );
        });
    });

    // quantile is generalization of median, where you can set the proportion. quantile(array, 0.5) is the same as median(array)
    describe('quantile', function () {
        it('should return quantile of array, ignoring non-numbers', function () {
            const data = [5, 5, 1, 1, NaN, 1, "asdf", undefined];
            const rules = [['quantile', 0.2]];
            assert.equal(
                dmt.applyRules(data, rules),
                1
            );
        });
    });

    // quantile is generalization of median, where you can set the proportion. quantile(array, 0.5) is the same as median(array)
    describe('quantileSorted', function () {
        it('should return quantile of array, ignoring non-numbers, and assuming the array is sorted', function () {
            const data = [5, 5, 1, 1, 1];
            const rules = [['quantileSorted', 0.2]];
            assert.equal(
                dmt.applyRules(data, rules),
                5
            );
        });
    });

    describe('variance', function () {
        it('should return variance of array, ignoring NaN and undefined', function () {
            const data = [1, 1, 1, 1, 1, 10, 20];
            const rules = ['variance'];
            assert.equal(
                dmt.applyRules(data, rules),
                55
            );
        });
    });

    describe('deviation', function () {
        it('should return variance of array, ignoring NaN and undefined', function () {
            const data = [10, 8, 10, 8, 8, 4];
            const rules = ['deviation'];
            assert.equal(
                round(dmt.applyRules(data, rules), 2),
                2.19
            );
        });
    });
    describe('fsum', function () {
        it('should return full precision sum of array', function () {
            const data = [.1, .1, .1, .1, .1, .1, .1, .1, .1, .1, ];
            const rules = ['fsum'];
            assert.equal(
                round(dmt.applyRules(data, rules), 2),
                1
            );
        });
    });
});

describe('numeric methods', function() {
    describe('round1', function() {
        it('should round halfs', function() {
            const data = 0.5;
            const rules = [ 'round' ];
            assert.equal(
                dmt.applyRules(data, rules),
                1
            );
        });
    });
    describe('round2', function() {
        it('should round halfs', function() {
            const data = -0.5;
            const rules = [ 'round' ];
            assert.equal(
                dmt.applyRules(data, rules),
                -1
            );
        });
    });
    describe('ceil small number', function() {
        it('should ceil small number', function() {
            const data = 1e-8;
            const rules = [ ['ceil', 2] ];
            assert.equal(
                dmt.applyRules(data, rules),
                0.01
            );
        });
    });
    describe('floor small number', function() {
        it('should floor small number', function() {
            const data = 1e-8;
            const rules = [ ['floor', 2] ];
            assert.equal(
                dmt.applyRules(data, rules),
                0
            );
        });
    });
    describe('round3', function() {
        it('should round a number', function() {
            const data = 5.12;
            const rules = [ ['floor', 1] ];
            assert.equal(
                dmt.applyRules(data, rules),
                5.1
            );
        });
    });
    describe('round4', function() {
        it('should round a number', function() {
            const data = -5.12;
            const rules = [ ['round', 1] ];
            assert.equal(
                dmt.applyRules(data, rules),
                -5.1
            );
        });
    });
    describe('ceil2', function() {
        it('should ceil a number', function() {
            const data = 5.12;
            const rules = [ ['ceil', 1] ];
            assert.equal(
                dmt.applyRules(data, rules),
                5.2
            );
        });
    });
    describe('ceil3', function() {
        it('should ceil a negative number', function() {
            const data = -5.12;
            const rules = [ ['ceil', 1] ];
            assert.equal(
                dmt.applyRules(data, rules),
                -5.1
            );
        });
    });
    describe('floor2', function() {
        it('should floor a number', function() {
            const data = 5.12;
            const rules = [ ['floor', 1] ];
            assert.equal(
                dmt.applyRules(data, rules),
                5.1
            );
        });
    });
    describe('floor3', function() {
        it('should floor a negative number', function() {
            const data = -5.12;
            const rules = [ ['floor', 1] ];
            assert.equal(
                dmt.applyRules(data, rules),
                -5.2
            );
        });
    });
    describe('trunc', function() {
        it('should trunc a number', function() {
            const data = 5.12;
            const rules = [ ['floor', 1] ];
            assert.equal(
                dmt.applyRules(data, rules),
                5.1
            );
        });
    });
    describe('trunc2', function() {
        it('should trunc a negative number', function() {
            const data = -5.12;
            const rules = [ ['trunc', 1] ];
            assert.equal(
                dmt.applyRules(data, rules),
                -5.1
            );
        });
    });
    describe('round5', function() {
        it('should round edge-case number', function() {
            const data = 1.005;
            const rules = [ ['round', 2] ];
            assert.equal(
                dmt.applyRules(data, rules),
                1.01
            );
        });
    });
    describe('round6', function() {
        it('should round edge-case number', function() {
            const data = 39.425;
            const rules = [ ['round', 2] ];
            assert.equal(
                dmt.applyRules(data, rules),
                39.43
            );
        });
    });
    describe('round7', function() {
        it('should round edge-case number', function() {
            const data = -1.005;
            const rules = [ ['round', 2] ];
            assert.equal(
                dmt.applyRules(data, rules),
                -1.01
            );
        });
    });
    describe('round8', function() {
        it('should round edge-case number', function() {
            const data = -39.425;
            const rules = [ ['round', 2] ];
            assert.equal(
                dmt.applyRules(data, rules),
                -39.43
            );
        });
    });
    describe('ceil4', function() {
        it('should ceil edge-case number', function() {
            const data = 9.130;
            const rules = [ ['ceil', 2] ];
            assert.equal(
                dmt.applyRules(data, rules),
                9.13
            );
        });
    });
    describe('ceil5', function() {
        it('should ceil edge-case number', function() {
            const data = 65.180;
            const rules = [ ['ceil', 2] ];
            assert.equal(
                dmt.applyRules(data, rules),
                65.18
            );
        });
    });
    describe('ceil6', function() {
        it('should ceil edge-case number', function() {
            const data = -2.260;
            const rules = [ ['ceil', 2] ];
            assert.equal(
                dmt.applyRules(data, rules),
                -2.26
            );
        });
    });
    describe('ceil7', function() {
        it('should ceil edge-case number', function() {
            const data = -18.150;
            const rules = [ ['ceil', 2] ];
            assert.equal(
                dmt.applyRules(data, rules),
                -18.15
            );
        });
    });
    describe('floor4', function() {
        it('should floor edge-case number', function() {
            const data = 2.260;
            const rules = [ ['floor', 2] ];
            assert.equal(
                dmt.applyRules(data, rules),
                2.26
            );
        });
    });
    describe('floor5', function() {
        it('should ceil edge-case number', function() {
            const data = 18.150;
            const rules = [ ['floor', 2] ];
            assert.equal(
                dmt.applyRules(data, rules),
                18.15
            );
        });
    });
    describe('floor6', function() {
        it('should floor edge-case number', function() {
            const data = -9.130;
            const rules = [ ['floor', 2] ];
            assert.equal(
                dmt.applyRules(data, rules),
                -9.13
            );
        });
    });
    describe('floor7', function() {
        it('should ceil edge-case number', function() {
            const data = -65.180;
            const rules = [ ['floor', 2] ];
            assert.equal(
                dmt.applyRules(data, rules),
                -65.18
            );
        });
    });
    describe('trunc4', function() {
        it('should trunc edge-case number', function() {
            const data = 2.260;
            const rules = [ ['trunc', 2] ];
            assert.equal(
                dmt.applyRules(data, rules),
                2.26
            );
        });
    });
    describe('trunc5', function() {
        it('should trunc edge-case number', function() {
            const data = 18.150;
            const rules = [ ['trunc', 2] ]
            assert.equal(
                dmt.applyRules(data, rules),
                18.15
            );
        });
    });
    describe('trunc6', function() {
        it('should trunc edge-case number', function() {
            const data = -9.130;
            const rules = [ ['trunc', 2] ]
            assert.equal(
                dmt.applyRules(data, rules),
                -9.13
            );
        });
    });
    describe('trunc7', function() {
        it('should trunc edge-case number', function() {
            const data = -65.180;
            const rules = [ ['trunc', 2] ]
            assert.equal(
                dmt.applyRules(data, rules),
                -65.18
            );
        });
    });
    describe('round9', function() {
        it('should round a number to tens', function() {
            const data = 1262.48;
            const rules = [ ['round', -1] ];
            assert.equal(
                dmt.applyRules(data, rules),
                1260
            );
        });
    });
    describe('round10', function() {
        it('should round a number to tens', function() {
            const data = 1262.48;
            const rules = [ ['round', -2] ];
            assert.equal(
                dmt.applyRules(data, rules),
                1300
            );
        });
    });
    describe('toFixed', function() {
        it('should turn a number into a string', function() {
            const data = 1.005;
            const rules = [ ['round', 2] ];
            assert.equal(
                dmt.applyRules(data, rules),
                '1.01'
            );
        });
    });
});

const swapiJson = {
    "name": "Luke Skywalker",
    "height": "172",
    "mass": "77",
    "hair_color": "blond",
    "skin_color": "fair",
    "eye_color": "blue",
    "birth_year": "19BBY",
    "gender": "male",
    "homeworld": "https://swapi.co/api/planets/1/",
    "films": [
        { "name":"film2", "url":"https://swapi.co/api/films/2/"},
        { "name":"film6", "url":"https://swapi.co/api/films/6/"},
        { "name":"film3", "url":"https://swapi.co/api/films/3/"},
        { "name":"film1", "url":"https://swapi.co/api/films/1/"},
        { "name":"film7", "url":"https://swapi.co/api/films/7/"}
    ],
    "species": [ "https://swapi.co/api/species/1/" ],
    "vehicles": [ "https://swapi.co/api/vehicles/14/", "https://swapi.co/api/vehicles/30/" ],
    "starships": [ "https://swapi.co/api/starships/12/", "https://swapi.co/api/starships/22/" ],
    "created": "2014-12-09T13:50:51.644000Z",
    "edited": "2014-12-20T21:17:56.891000Z",
    "url": "https://swapi.co/api/people/1/"
};

describe('select2', function () {
    it('should return a field from an object', function () {
        const rules = [ ['select', '$.name'] ];
        assert.equal(
            dmt.applyRules(swapiJson, rules),
            'Luke Skywalker'
        );
    });
});

describe('select shorthand', function () {
    it('should return a field from an object', function () {
        const rules = [ '$.name' ];
        assert.equal(
            dmt.applyRules(swapiJson, rules),
            'Luke Skywalker'
        );
    });
});

describe('select and length', function () {
    it('should return length of selected array', function () {
        const rules = [ ['select', '$.films'], 'length' ];
        assert.equal(
            dmt.applyRules(swapiJson, rules),
            5
        );
    });
});

describe('transform', function () {
    it('should return a new json according to the template', function () {
        const template = JSON.stringify({
            type: "character",
            name: ['!!', '$.name'],
            films: ["!!", '$.films', 'length'],
            filmNames: ["!!", ["selectAll", "$.films..name"]],
            firstFilm: ["!!", "$.films..name"]
        })
        expect(
            dmt.transform(swapiJson, template),
        ).to.eql({
            "type": "character",
            "name": "Luke Skywalker",
            films: 5,
            filmNames: ["film2", "film6", "film3", "film1", "film7"],
            firstFilm: "film2"
        })
    });
});
