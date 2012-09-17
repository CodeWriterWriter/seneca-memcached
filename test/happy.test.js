
var memcached = require('../lib/memcached.js')

var async     = require('async')
var eyes      = require('eyes')
var assert    = require('assert')


module.exports = {
  happy: function() {
    
    var mp = new memcached.plugin()
    mp.init({add:function(){},log:function(){console.log(Array.prototype.slice.call(arguments))}},{},function(err){
      if( err ) throw err;

      async.series({
        set1: function(callback) {
          mp.set({key:'k1',val:'v1'},function(err){
            assert.isNull((err||null))
            callback()
          })
        },

        get1: function(callback) {
          mp.get({key:'k1'},function(err,out){
            assert.isNull((err||null))
            assert.equal('v1',out)
            callback()
          })
        },

        set2: function(callback) {
          mp.set({key:'k2',val:{a:1}},function(err){
            assert.isNull((err||null))
            callback()
          })
        },

        get2: function(callback) {
          mp.get({key:'k2'},function(err,out){
            assert.isNull((err||null))
            assert.equal(JSON.stringify({a:1}),JSON.stringify(out))
            callback()
          })
        },


/* Date will need patch to memcached module
        set3: function(callback) {
          mp.set({key:'k3',val:new Date(2020,2,2)},function(err){
            assert.isNull((err||null))
            callback()
          })
        },

        get3: function(callback) {
          mp.get({key:'k3g'},function(err,out){
            assert.isNull((err||null))
            assert.equal(new Date(2020,2,2).getTime(),out.getTime())
            callback()
          })
        },
*/

        close1: function(callback) {
          mp.close(function(err){
            console.log('close:'+err)
          })
        }

      }, function(err,out) {
        console.log('done:'+err)
      })
    })
  }
}
