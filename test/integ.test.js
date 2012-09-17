
var seneca = require('../../seneca/lib/seneca.js')

var async     = require('async')
var eyes      = require('eyes')
var assert    = require('assert')


module.exports = {
  integ: function() {
    seneca({plugins:['../../seneca-memcached/lib/memcached']},function(err,si){
      assert.isNull(err)

      async.series({
        set1: function(cb) {
          si.act({role:'cache',cmd:'set',key:'a1',val:'b1'},function(err,out){
            assert.isNull(err)
            assert.ok(out)
            cb()
          })
        },

        get1: function(cb) {
          si.act({role:'cache',cmd:'get',key:'a1'},function(err,out){
            assert.isNull(err)
            assert.equal('b1',out)
            cb()
          })
        },


        set2: function(cb) {
          si.act({role:'cache',cmd:'set',key:'c1',val:0},function(err,out){
            assert.isNull(err)
            assert.ok(out)
            cb()
          })
        },

        incr1: function(cb) {
          si.act({role:'cache',cmd:'incr',key:'c1',val:1},function(err,out){
            assert.isNull(err)
            assert.ok(out)
            cb()
          })
        },

        get2: function(cb) {
          si.act({role:'cache',cmd:'get',key:'c1'},function(err,out){
            assert.isNull(err)
            assert.equal(1,out)
            cb()
          })
        },

        incr2: function(cb) {
          si.act({role:'cache',cmd:'incr',key:'c1',val:1},function(err,out){
            assert.isNull(err)
            assert.ok(out)
            cb()
          })
        },

        get3: function(cb) {
          si.act({role:'cache',cmd:'get',key:'c1'},function(err,out){
            assert.isNull(err)
            assert.equal(2,out)
            cb()
          })
        },


      },function(){})
    })
  }    
}
