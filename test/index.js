import * as dmt from '../src/index.js'
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
                round(null, dmt.applyRules(data, rules), 2),
                2.19
            );
        });
    });
    describe('fsum', function () {
        it('should return full precision sum of array', function () {
            const data = [.1, .1, .1, .1, .1, .1, .1, .1, .1, .1, ];
            const rules = ['fsum'];
            assert.equal(
                dmt.applyRules(data, rules),
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

describe('selects', function () {
    describe('select2', function () {
        it('should return a field from an object', function () {
            const rules = [['select', '$.name']];
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
            const rules = [['select', '$.films'], 'length'];
            assert.equal(
                dmt.applyRules(swapiJson, rules),
                5
            );
        });
    });
    //todo: remove this
    describe('jsonata', function () {
        it('should return jsonata evaluated expression', function () {
            const rules = [['jsonata', 'name']];
            assert.equal(
                dmt.applyRules(swapiJson, rules),
                'Luke Skywalker'
            );
        });
    });
});

describe("each", function() {
    it ('should apply the provided rules on each item in the array', function () {
        const rules = [['each', ['round']]];
        const data = [17.2, 1.5, 9.49999, -5.3, -5.5, 2.0001]
        expect(
            dmt.applyRules(data, rules)).to.eql(
                [17, 2, 9, -5, -6, 2]
        );
    })
})

describe("map", function() {
    it ('should apply the provided template on the object', function () {
        const template = {
            name: ["!!", "$.fullName"],
            phone: ["!!", "$.phone"]
        };
        const rules = [["map", template]]
        const data = {
            fullName: "John Doe",
            phone: "1234567890",
            address: "Penny lane 7, Liverpool"
        }
        expect(
            dmt.applyRules(data, rules)).to.eql(
            {
                name: "John Doe",
                phone: "1234567890"
            }
        );
    })
})

describe("each - map", function() {
    it ('should apply the provided template on each item in the array', function () {
        const template = {
            name: ["!!", "$.fullName"],
            phone: ["!!", "$.phone"]
        };
        const rules = [["each", [["map", template]]]]
        const data = [{
            fullName: "John Doe",
            phone: "1234567890",
            address: "Penny lane 7, Liverpool"
        },{
            fullName: "Elza D.",
            phone: "8787878787",
            address: "Ice palace, Wonderland"
        }]
        expect(
            dmt.applyRules(data, rules)).to.eql(
            [{
                name: "John Doe",
                phone: "1234567890"
            },{
                name: "Elza D.",
                phone: "8787878787"
            }]
        );
    })
})



describe('transform', function () {
    describe('transform each-map', function () {
        it('should return a new json according to the template', function () {
            const template = JSON.stringify(
        {"b":["!!", ["each", [["map", {
                "name": ["!!", "$.name"],
                "email": ["!!", "$.email"]
                }]]]]}
            );
            const data = [{
                "_id": "61281445910b9d4c3bc0ed50",
                "index": 529,
                "name": "Elise Landry",
                "email": "eliselandry@unia.com",
                "phone": "+1 (902) 442-3272",
                "friends": [
                    {
                        "id": 0,
                        "name": "Jannie Henry"
                    },
                    {
                        "id": 1,
                        "name": "Margaret Guerrero"
                    },
                    {
                        "id": 2,
                        "name": "Shepard Carr"
                    }
                ]
            },
                {
                    "_id": "6128144551fd14ee6d6239ce",
                    "index": 530,
                    "guid": "449ca924-1b85-41ab-890b-370788268948",
                    "name": "Constance Craig",
                    "friends": [
                        {
                            "id": 0,
                            "name": "Burnett Wilcox"
                        },
                        {
                            "id": 1,
                            "name": "Vega Hobbs"
                        },
                        {
                            "id": 2,
                            "name": "Serena Roach"
                        }
                    ]
                }
            ];
            expect(
                dmt.transform(data, template),
            ).to.eql({
                b: [
                    {
                        "name": "Elise Landry",
                        "email": "eliselandry@unia.com"
                    },
                    {
                        "name"
                    :
                        "Constance Craig"
                    }
                ]
            })
        });
    });
    describe('simple transform', function () {
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
});

describe("no-rules", function() {
    it ('should output the template as is', function () {
        const template = JSON.stringify({"b":2})
        expect(dmt.transform(swapiJson, template)).to.eql(JSON.parse(template));
    })
})

describe("each-map", function() {
    it ('should transform each item in the array', function () {
        const template = JSON.stringify(["!!",
            ["each",
                [["map", {
                    "name": ["!!", "$.name"],
                    "email": ["!!", "$.email"],
                    "tags": ["!!", "$.tags", ["join", ","]]
                }]]
            ]
        ]);
        const data = [{
            "id": "61281445910b9d4c3bc0ed50",
            "balance": "$1,025.68",
            "picture": "http://placehold.it/32x32",
            "age": 30,
            "name": "Elise Landry",
            "gender": "female",
            "email": "eliselandry@unia.com",
            "phone": "+1 (902) 442-3272",
            "tags": [
                "ad",
                "ipsum",
                "id",
                "aliquip",
                "irure",
                "aute",
                "et"
            ]
        },
            {
                "id": "6128144551fd14ee6d6239ce",
                "balance": "$1,135.05",
                "picture": "http://placehold.it/32x32",
                "age": 21,
                "name": "Constance Craig",
                "gender": "female",
                "email": "constancecraig@tribalog.com",
                "phone": "+1 (941) 541-2934",
                "tags": [
                    "sit",
                    "est",
                    "eu",
                    "voluptate",
                    "dolor",
                    "laboris",
                    "ad"
                ]
            }
        ];
        expect(
            dmt.transform(data, template))
        .to.eql(
            [
                {
                    "name": "Elise Landry",
                    "email": "eliselandry@unia.com",
                    "tags": "ad,ipsum,id,aliquip,irure,aute,et"
                },{
                    "name": "Constance Craig",
                    "email": "constancecraig@tribalog.com",
                    "tags": "sit,est,eu,voluptate,dolor,laboris,ad"
                }
            ]
        );
    })
})

describe("extensions", function() {
    describe("extensions provider", function () {
        it('call extensions provider when hitting $$. rule', function () {
            const extensionsProvider = (ctx, data, ext) => {
                return ext;
            }
            const data = {};
            const rules = ['$$.foo']
            assert.equal(
                dmt.applyRules(data, rules, { extensionsProvider }),
                'foo'
            );
        })
    });
    describe("extensions with params", function () {
        it ('call extensions provider when hitting $$. rule and pass params and data', function () {
            const extensionsProvider = (ctx, data, ext, options) => {
                if (ext === 'add') {
                    return data + options[0];
                }
            }
            const data = 5;
            const rules = [['$$.add', 7]]
            assert.equal(
                dmt.applyRules(data, rules, { extensionsProvider }),
                12
            );
        })
    });
});

describe("date and time", function() {
    describe("now", function () {
        it('should return a date object', function () {
            const data = {};
            const rules = ['now']
            const res = dmt.applyRules(data, rules);
            assert(
                res instanceof Date,
            );
        })
    });
    describe("date format", function () {
        it ('should format a date object according to default locale', function () {
            const data = new Date('2021-08-28T22:25:52.688Z');
            const rules = [['timeFormat', '%x %X']]
            assert.equal(
                dmt.applyRules(data, rules),
                '8/29/2021 1:25:52 AM' // default locale is en-US:
            );
        })
    });
});


describe("Array methods", function() {
    describe("reverse", function () {
        it('should reverse the order of the array', function () {
            const rules = ['reverse'];
            const data = [3, 6, 4, 8, 10]
            expect(
                dmt.applyRules(data, rules)).to.eql(
                [10, 8, 4, 6, 3]
            );
        })
    });

    describe("sort", function () {
        it('should sort the array', function () {
            const rules = ['sort'];
            const data = [3, 6, 4, 8, 10]
            expect(
                dmt.applyRules(data, rules)).to.eql(
                [3, 4, 6, 8, 10]
            );
        })
    });

    describe("sort desc", function () {
        it('should sort the array descending', function () {
            const rules = [['sort', 'desc']];
            const data = [3, 6, 4, 8, 10]
            expect(
                dmt.applyRules(data, rules)).to.eql(
                [10,8,6,4,3]
            );
        })
    });

    describe("sort desc objects", function () {
        it('should sort the array descending by the specified field', function () {
            const rules = [['sort', 'desc', 'age']];
            const data = [{name: 'John', age: 43}, {name: 'Benny', age: 58}, {name: 'Dina', age: 27}]
            expect(
                dmt.applyRules(data, rules)).to.eql(
                [{name: 'Benny', age: 58}, {name: 'John', age: 43}, {name: 'Dina', age: 27}]
            );
        })
    });

    describe("concat", function () {
        it('should concatenate all members of an array into one array. members can be arrays or scalars', function () {
            const rules = ['concat'];
            const data = [[3, 6, 4, 8, 10],7,[2,3,11],22]
            expect(
                dmt.applyRules(data, rules)).to.eql(
                [3, 6, 4, 8, 10, 7, 2, 3, 11, 22]
            );
        })
    });

    // describe("difference", function () {
    //     it('should return an arrays with values that appear in one array only', function () {
    //         const rules = ['difference'];
    //         const data = [[0, 1, 2, 0], [1]]
    //         expect(
    //             dmt.applyRules(data, rules)).to.eql(
    //             [0,2]
    //         );
    //     });
    // });

    describe("union", function () {
        it('should return an arrays with unique values from all arrays', function () {
            const rules = ['union'];
            const data = [[0, 2, 1, 0], [1, 3]]
            expect(
                dmt.applyRules(data, rules)).to.eql(
                [0, 2, 1, 3]
            );
        });
    });

    describe("intersection", function () {
        it('should return an arrays with the intersection of all arrays', function () {
            const rules = ['intersection'];
            const data = [[0, 2, 1, 0], [1, 3]]
            expect(
                dmt.applyRules(data, rules)).to.eql(
                [1]
            );
        });
    });
});