var seneca = require('seneca')()
seneca.use('..')

seneca.act({role:'cache', cmd:'set', key:'k1', val:'v1'}, function(err){

  seneca.act({role:'cache', cmd:'get', key:'k1'}, function(err,val){
    console.log('value = '+val)

    //seneca.act({role:'seneca', cmd:'close'})
  })
})


var cache = seneca.pin({role:'cache',cmd:'*'})

cache.set({key:'k1', val:'v1'}, function(err){

  cache.get({key:'k1'}, function(err,val){
    console.log('value = '+val)
  })
})
