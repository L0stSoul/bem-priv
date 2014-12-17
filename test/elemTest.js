var assert = require('chai').assert;
var BEMPRIV = require('../');

var plainBench = require('../benchmark/real/real__plain');
var bemprivBench = require('../benchmark/real/real__bem');
var objectsBench = require('../benchmark/real/real__object');
var baselineBemjson = require('./benchmark.json');
var inherit = require('inherit');

describe('BEMPRIV', function() {
    describe('Elems', function() {
        it('Should return elements with this.elem, and should init elems correctly',  function() {
            BEMPRIV.decl('block', {
                init: function() {
                    this.content([
                        this.elem('title'),
                        this.elem('text'),
                    ]);
                },
                method1: function() {
                    return 'base 1';
                },
                method2: function() {
                    return 'base 2';
                }
            });

            BEMPRIV.decl({
                block: 'block',
                elem: 'title'
            }, {
                init: function() {
                    this.content([this.method1(), this.block.method2()]);
                },
                method1: function() {
                    return 'title 1';
                }
            });

            BEMPRIV.decl({
                block: 'block',
                elem: 'text'
            }, {
                init: function() {
                    this.content([this.method1(), this.block.method2()]);
                },
                method1: function() {
                    return 'text 1';
                }
            });

            assert.deepEqual(BEMPRIV.json('block'), {
                block: 'block',
                content: [
                    {
                        block: 'block',
                        elem: 'title',
                        content: [
                            'title 1',
                            'base 2'
                        ],

                    },
                    {
                        block: 'block',
                        elem: 'text',
                        content: [
                            'text 1',
                            'base 2'
                        ]
                    }
                ]
            });
        });
        it('Should correctly handle params in elements', function() {
            BEMPRIV.decl({ block: 'block2'}, {
                bemjson: function() {
                    return this.elem('head', { a: 2 });
                }
            });

            BEMPRIV.decl({
                block: 'block2',
                elem: 'head',
            },
            {
                bemjson: function() {
                    return this.params.a;
                }
            });
            assert.equal(BEMPRIV.json('block2'), 2);
        });

        it('should correctly select block by id', function() {
            BEMPRIV.decl({ block: 'block3', id: 'test-1' }, {
                bemjson: function() {
                    return 1;
                }
            });
            BEMPRIV.decl({ block: 'block3', id: 'test-2' }, {
                bemjson: function() {
                    return 2;
                }
            });

            assert.equal(BEMPRIV.createById('test-1').bemjson(), 1);
            assert.equal(BEMPRIV.createById('test-2').bemjson(), 2);
        });

        it('should correctly accept parent block for creation', function() {
            BEMPRIV.decl({ block: 'block4', id: 'test-3' }, {
                foo: function() {
                    return 1;
                }
            });
            BEMPRIV.decl({ block: 'block4', id: 'test-4' }, {
                bemjson: function() {
                    return this.foo();
                }
            });

            assert.equal(BEMPRIV.createById('test-4', inherit(BEMPRIV, {
                foo: function() { return 3; }
            })).bemjson(), 3);
        });

    });
});
