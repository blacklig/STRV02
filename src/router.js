"use strict";

const Router = require('koa-router')
const util = require('util')    // package for better console output

const validate = require('./utils/validate')

const cats = require('./cats')


const router = new Router()

router.get('/',(ctx) => {
    ctx.body = 'Welcome to catbook!'
})

// displaying all cats in our array
router.get('/cats',(ctx) => {
    ctx.body = cats
    console.log('request received')

})



// displaying selected cat by ID or by name - name might not be unique
router.get('/cats/:a',(ctx) => {

    // what happens when we not find our cat in "database"
    let notFound = (param) => {
        let message = 'Cat '+param+' not found'
        console.log(message)
        ctx.body = message
        ctx.status = 404
    }

    // looking for cat by ID number
    if (Number(ctx.params.a) >= 0) { // NaN >= will result to fail => we go to else
        if (!cats.find((element) => {
            if (Number(element.id) === Number(ctx.params.a)) {
                ctx.body = element
           console.log(element.id)
                return 1
            }
        })) notFound(ctx.params.a)
    }

    // looking for cat by name
    else {
        let output = []
        let foundSomething = 0
        cats.find((element) => {
            if (element.name === ctx.params.a) {
                output.push(element)
                foundSomething = 1
                console.log(element)
            }
        })
        if (foundSomething) ctx.body = output
        else notFound(ctx.params.a)
    }
})


// inserting a new cat
router.post('/catspost',(ctx) => {

    try {
        validate(ctx.request.body)

        // validating, if there is not another cat with same ID
        console.log((ctx.request.body.id))

        // there must be no cat with id we are receiving to proceed further and insert it
        if (!cats.find((element) => {
            if (Number(element.id) === Number((ctx.request.body.id)) ) return 1 // we found cat with same id, problem
            console.log('eid: '+element.id)
        })) {
            cats.push(ctx.request.body)
            ctx.body = cats
            console.log(`Received: ${util.inspect(ctx.request.body, true, 5, true)}`)
        } else {
            let message = 'There is already cat with '+ ctx.request.body.id +' ID. Cannot insert new one'
            console.log(message)
            ctx.body = message
        }
    } catch (err) {
        let errMessage = `Error on validationg data!\n${err}`
        console.log(err)
        ctx.body = errMessage
        ctx.status = 500

        console.log(errMessage)
        console.log(ctx.request.body)
    }

})

module.exports = router.routes()

