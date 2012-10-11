/* Copyright (c) 2012 Richard Rodger */


var _ = require('underscore')
var Memcached = require('memcached')


function err( cb ) {
  return function(err,out) {
    if( err ) return cb(err);
    win(out)
  }
}



function MemcachedPlugin() {
  var self = {}
  self.name = 'memcached'


  var seneca
  var opts
  var mi

  
  function setter(kind) {
    return function(args,cb) {
      var key = args.key
      var val = args.val
      var expires = args.expires || opts.expires
      mi[kind](key,val,expires,function(err,out){
        cb(err,out)
      })
    }
  }


  self.set     = setter('set')
  self.add     = setter('add')
  self.replace = setter('replace')
  self.cas     = setter('cas')
  self.append  = setter('append')
  self.prepend = setter('prepend')


  function bykey(kind) {
    return function(args,cb) {
      var key = args.key
      mi[kind](key,function(err,out){
        cb(err,out)
      })
    }
  }

  self.get = bykey('get')
  self.gets = bykey('gets')
  self.delete = bykey('delete')


  function incrdecr(kind) {
    return function(args,cb) {
      var key = args.key
      var val = args.val
      mi[kind](key,val,function(err,out){
        cb(err,out)
      })
    }
  }

  self.incr = incrdecr('increment')
  self.decr = incrdecr('decrement')


  function noargs(kind) {
    return function(args,cb) {
      mi[kind](cb)
    }
  }

  self.flush = noargs('flush')
  self.stats = noargs('stats')
  self.close = noargs('end')




  self.init = function(seneca,initopts,cb) {
    seneca = seneca
    opts   = _.extend({
      expires:3600,
      servers:['127.0.0.1:11211'],
      // default options as per memcached module
    },initopts)


    var role = opts.role || 'cache'


    // core
    seneca.add({role:role,cmd:'set'},self.set)
    seneca.add({role:role,cmd:'get'},self.get)
    seneca.add({role:role,cmd:'add'},self.add)
    seneca.add({role:role,cmd:'delete'},self.delete)
    seneca.add({role:role,cmd:'incr'},self.incr)
    seneca.add({role:role,cmd:'decr'},self.decr)

    seneca.add({role:'seneca',cmd:'close'},self.close)

    // specific
    seneca.add({role:role,cmd:'replace'},self.replace)
    seneca.add({role:role,cmd:'append'},self.append)
    seneca.add({role:role,cmd:'prepend'},self.prepend)
    seneca.add({role:role,cmd:'cas'},self.cas)
    seneca.add({role:role,cmd:'gets'},self.gets)
    seneca.add({role:role,cmd:'stats'},self.stats)
    seneca.add({role:role,cmd:'flush'},self.flush)

    mi = new Memcached(opts.servers,opts)

    // log all events
    var origemit = mi.emit
    mi.emit = function(){
      var args = Array.prototype.slice.call(arguments)
      seneca.log.apply(seneca,args)
      origemit.apply(mi,args)
    }

    cb()
  }


  return self
}


module.exports = new MemcachedPlugin()
