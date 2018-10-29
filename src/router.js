'use strict'

const util = require('util')
const Router = require('koa-router')
const validate = require('./utils/validate')
const cats = require('./cats')

const router = new Router()

// "homepage"
router.get('/', ctx => {
  ctx.body = 'Welcome to catbook!'
})

// displaying all cats in array
router.get('/cats', ctx => {
  ctx.body = cats
  console.log('request received')
})

// displaying selected cat by ID or by name - name might not be unique
router.get('/cats/:a', ctx => {
  // what happens when we not find our cat in "database"
  const notFound = function(arg) {
    const message = `Cat ${arg} not found`
    console.log(message)
    ctx.body = message
    ctx.status = 404
  }

  // looking for cat by ID number
  if (Number(ctx.params.a) >= 0) {
    if (!cats.find(element => {
      if (Number(element.id) === Number(ctx.params.a)) {
        ctx.body = element
        console.log(element.id)
        return 1
      }
    })) { notFound(ctx.params.a) }
  }

  // looking for cat by name
  else {
    const output = []
    let foundSomething = 0
    cats.find(element => {
      if (element.name.toLowerCase() === ctx.params.a.toLowerCase()) {
        output.push(element)
        foundSomething = 1
        console.log(element)
      }
    })
    if (foundSomething) { ctx.body = output } else { notFound(ctx.params.a) }
  }
})


// inserting a new cat
router.post('/catspost', ctx => {
  try {
    validate(ctx.request.body)

    // validating, if there is not another cat with same ID
    console.log(ctx.request.body.id)

    // there must be no cat with id we are receiving to proceed further and insert it
    if (!cats.find(element => {
      // we found cat with same id, problem
      if (Number(element.id) === Number(ctx.request.body.id)) { return 1 }
    })) {
      cats.push(ctx.request.body)
      ctx.body = cats
      console.log(`Received: ${util.inspect(ctx.request.body, true, 5, true)}`)
    } else {
      const message = `There is already cat with ${ctx.request.body.id} ID. Cannot insert new one`
      console.log(message)
      ctx.body = message
    }
  } catch (err) {
    const errMessage = `Error on validationg data!\n${err}`
    console.log(err)
    ctx.body = errMessage
    ctx.status = 500

    console.log(errMessage)
    console.log(ctx.request.body)
  }
})

// deleting works only by ID as name might not be unique
router.post('/catsdelete/:id', ctx => {
  // firstly we look up for ID we want to delete
  cats.find((element, index) => {
    if (Number(ctx.params.id) === Number(element.id)) {
      const message = `Cat with ID ${element.id} deleted.`
      cats.splice(index, 1)
      console.log(message)
      ctx.body = message
      return 1
    }
    const message = `No such cat with ID ${ctx.params.id} found! Cannot delete it`
    console.log(message)
    ctx.body = message
  })
})

// updating works only by ID as name might not be unique
// updating cat gets specified by /ID[number] param and new info
// must be in same JSON format as when POSTING new cat, including new or same ID, depends on what we want to change..
// problem occurs when we want to update and give ID as already existing cat
router.post('/catsupdate/:id', ctx => {
  // at first we even have to check, if provided data are valid, then we can continue further
  try {
    validate(ctx.request.body)
    // firstly we have to check, if ID of object we want to change doesnt want to change its ID itself, and if yes, if such ID is free
    let conflictWithIDs = 0
    if (ctx.params.id != ctx.request.body.id) { // looks like we want to change ID of changed object... Yes, we want != not !== as those messy objects with messy types would require more work
      cats.find(element => {
        if (element.id === ctx.request.body.id) { // it is already in "database", we halt execution here, cannot modify
          const message = `Conflict with IDs - cannot change ID of object w ID ${ctx.params.id} to ${ctx.request.body.id} because there is already object with ${ctx.request.body.id} ID`
          console.log(message)
          ctx.body = message
          conflictWithIDs = 1
          return 0
        }
      })
    }

    // looks like we dont have any intentions to modify ID of updated object so we want to proceed
    if (!conflictWithIDs) {
      // firstly we look up for ID we want to update
      const didWeFindTheCat = cats.find((element, index) => {
        console.log(ctx.params.id)
        if (Number(element.id) === Number(ctx.params.id)) {
          const message = `Cat with ID ${element.id} UPDATED to. \n${JSON.stringify(ctx.request.body)}`
          cats.splice(index, 1, ctx.request.body)
          console.log(message)
          ctx.body = message
          return 1
        }
      })

      if (!didWeFindTheCat) {
        const message = `No such cat with ID ${ctx.params.id} found! Cannot update it`
        console.log(message)
        ctx.body = message
      }
    }
  } catch (err) { // bad I know, it is duplicatino of above catch block. Should be all in one place at error handler..
    const errMessage = `Error on validationg data!\n${err}`
    console.log(err)
    ctx.body = errMessage
    ctx.status = 500
    console.log(errMessage)
    console.log(ctx.request.body)
  }
})
// using those flags as I did is probably not the best solution, throwing errors and having cleaner code would be better.


module.exports = router.routes()

