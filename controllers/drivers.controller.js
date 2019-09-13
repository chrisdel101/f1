const utils = require('../utils')
const cache = require('../cache')
const urls = require('../urls')
const indexController = require('./index.controller')

// check cache in indexController for data before calling db
async function handleFormData() {
  const drivers = await indexController.handleDrivers()
  const teams = await indexController.handleTeams()
  return {
    drivers,
    teams
  }
}
// fetchs the driver info from the api to use in render func
async function fetchDriverAPI(ctx, render) {
  // get query params from GET req
  let driverSlug
  if (render === 'page') {
    driverSlug = ctx.query.driver
  } else if (render === 'card') {
    driverSlug = ctx.params.driver_slug
  }
  // console.log('Q', driverSlug)
  // pass form data from cache to template
  const formData = await handleFormData()
  // set data to vars
  const driversObj = formData.drivers
  const teamsObj = formData.teams
  // query driver by slug
  const driverData = JSON.parse(await utils.fetchData(`drivers/${driverSlug}`))
  // look up drivers team by id
  const teamData = JSON.parse(
    await utils.fetchData(`teams/${driverData.team_id}`)
  )
  return {
    driverData,
    teamData,
    driversObj,
    teamsObj
  }
}
// use driver api data to rendercard only
async function renderDriverCard(ctx) {
  const { driverData, teamData, driversObj, teamsObj } = await fetchDriverAPI(
    ctx,
    'card'
  )
  const teamUrl = `/team?team=${driverData.team_name_slug}`
  // add link to team to driver
  driverData['teamUrl'] = teamUrl
  driverData['logo_url'] = teamData.logo_url
  // console.log('Driver Data', driverData)
  return await ctx.render('driverPage', {
    //  +++ index params +++
    urls: ctx.urls,
    method: 'GET',
    routeName: 'driverCard',
    driverData: driverData,
    teamData: teamData
  })
}
// use driver api data to render full template
async function renderDriverTemplate(ctx) {
  const { driverData, teamData, driversObj, teamsObj } = await fetchDriverAPI(
    ctx,
    'page'
  )
  const teamUrl = `/team?team=${driverData.team_name_slug}`
  // add link to team to driver
  driverData['teamUrl'] = teamUrl
  driverData['logo_url'] = teamData.logo_url
  return await ctx.render('driverPage', {
    //  +++ index params +++
    urls: ctx.urls,
    method: 'GET',
    title: ctx.title,
    driverAction: driversObj.driverAction,
    teamAction: teamsObj.teamAction,
    buttonField: 'Submit',
    buttonType: 'submit',
    buttonValue: 'submit',
    driverSelectName: driversObj.selectName,
    driverEnums: driversObj.driversArr,
    teamSelectName: teamsObj.selectName,
    teamsEnums: teamsObj.teamsArr,
    // +++ ---- +++
    routeName: 'driver',
    driverData: driverData,
    teamData: teamData,
    allData: { ...driverData, ...teamData }
  })
}
module.exports = {
  renderDriverTemplate,
  renderDriverCard
}
