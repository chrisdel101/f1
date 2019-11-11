const cacheController = require('../../controllers/cache.controller')
const teamsController = require('../../controllers/teams.controller')
var assert = require('assert')
const cache = require('../../cache')
const utils = require('../../utils')
const sinon = require('sinon')

const teamDataObj = {
  base: 'Brackley, United Kingdom',
  championship_titles: '5',
  drivers_scraped: [
    { driver_name: 'Lewis  Hamilton', name_slug: 'lewis-hamilton' },
    { driver_name: 'Valtteri Bottas', name_slug: 'valtteri-bottas' }
  ],
  fastest_laps: '61',
  first_team_entry: '1970',
  flag_img_url:
    'https://www.formula1.com//content/fom-website/en/teams/Mercedes/_jcr_content/countryFlag.img.png/1421365156900.png',
  full_team_name: 'Mercedes AMG Petronas Motorsport',
  highest_race_finish: '1 (x88)',
  id: 21,
  logo_url:
    'https://www.formula1.com//content/fom-website/en/teams/Mercedes/_jcr_content/logo.img.jpg/1486740144183.jpg',
  main_image:
    'https://www.formula1.com//content/fom-website/en/teams/Mercedes/_jcr_content/image16x9.img.1536.medium.jpg/1561122939027.jpg',
  podium_finishes: '181',
  pole_positions: '101',
  power_unit: 'Mercedes',
  team_chief: 'Toto Wolff',
  team_name_slug: 'mercedes',
  technical_chief: 'James Allison',
  url_name_slug: 'Mercedes',
  driverFlags: [
    'https://www.formula1.com//content/fom-website/en/drivers/lewis-hamilton/_jcr_content/countryFlag.img.jpg/1536080051510.jpg',
    'https://www.formula1.com//content/fom-website/en/drivers/valtteri-bottas/_jcr_content/countryFlag.img.gif/1423762801690.gif'
  ]
}
describe('teams.controllers', function() {
  describe('combineDriverDataOnTeam()', function() {
    it('runs combineDriverData ', async function() {
      const res = await teamsController.combineDriverDataOnTeam(teamDataObj)
      assert(res.drivers_scraped[0].hasOwnProperty('flag_img_url'))
      assert(res.drivers_scraped[0].hasOwnProperty('api_call'))
    })
  })
  describe('fetchTeamAPI()', () => {
    it('fetchTeamAPI response contains teamData prop', function() {
      const ctx = {
        params: {
          team_slug: 'some-team'
        }
      }

      return teamsController.fetchTeamAPI(ctx, 'card').then(res => {
        assert(res.hasOwnProperty('teamData'))
      })
    })
    it('fetchTeamAPI teamData contains correct data ', function() {
      const ctx = {
        query: {
          driver: 'some-driver'
        }
      }
      return teamsController.fetchTeamAPI(ctx, 'page').then(res => {
        assert(res.driversObj)
        assert(res.teamsObj)
      })
    })
    // fails for some reason sometimes
    it('fetchTeamAPI calls fetchData() - type = card', function() {
      const ctx = {
        params: {
          team_slug: 'some-driver'
        }
      }
      sinon.spy(utils, 'fetchData')
      return teamsController.fetchTeamAPI(ctx, 'card').then(res => {
        return Promise.resolve(utils.fetchData.returnValues[0]).then(res => {
          assert(utils.fetchData.called)
          utils.fetchData.restore()
        })
      })
    })
    // TODO needs to works with test endpoint
    it.skip('fetchTeamAPI teamData contains correct data', function() {
      const ctx = {
        query: {
          driver: 'some-driver'
        }
      }
      return teamsController.fetchTeamAPI(ctx, 'page').then(res => {
        console.log(res)
      })
    })
  })
  describe('fetchTeamsAPI', () => {
    it('fetchTeamsAPI returns teamsObj', function() {
      return teamsController.fetchTeamsAPI().then(res => {
        assert(res.hasOwnProperty('teamsObj'))
      })
    })
    it('fetchTeamsAPI teamsObj has correct props', function() {
      return teamsController.fetchTeamsAPI().then(res => {
        assert(
          res.teamsObj.hasOwnProperty('teamsArr') &&
            res.teamsObj.hasOwnProperty('teamText') &&
            res.teamsObj.hasOwnProperty('selectName')
        )
        assert(res.teamsObj.teamsArr.length)
      })
    })
  })
  describe('renderTeamTemplate()', () => {
    it('renderTeamTemplate gets fetchTeamAPI() data successfully', function() {
      const mockCtx = {
        query: {
          team: 'red_bull_racing'
        },
        // fake render func
        render: function(templateName, options) {
          return
        }
      }
      sinon.spy(teamsController, 'fetchTeamAPI')
      return Promise.resolve(teamsController.renderTeamTemplate(mockCtx)).then(
        res => {
          assert(teamsController.fetchTeamAPI.calledOnce)
          // resolve promise from inner function
          return Promise.resolve(
            teamsController.fetchTeamAPI.returnValues[0]
          ).then(res => {
            console.log(res)
            // checks for all keys
            assert(res.hasOwnProperty('teamData'))
            // assert(res.hasOwnProperty('teamsObj'))
            // assert(res.hasOwnProperty('driversObj'))
            // make sure no empty objs
            assert(
              !utils.isObjEmpty(res.teamData)
              // !utils.isObjEmpty(res.teamsObj) &&
              // !utils.isObjEmpty(res.driversObj)
            )
            teamsController.fetchTeamAPI.restore()
          })
        }
      )
    })
    it('renderTeamTemplate gets fetchTeamsAPI() data successfully', function() {
      const mockCtx = {
        query: {
          team: 'red_bull_racing'
        },
        // fake render func
        render: function(templateName, options) {
          return
        }
      }
      sinon.spy(teamsController, 'fetchTeamsAPI')
      return Promise.resolve(teamsController.renderTeamTemplate(mockCtx)).then(
        res => {
          assert(teamsController.fetchTeamsAPI.calledOnce)
          // resolve promise from inner function
          return Promise.resolve(
            teamsController.fetchTeamsAPI.returnValues[0]
          ).then(res => {
            console.log(res)
            // checks for all keys
            assert(res.hasOwnProperty('teamsObj'))
            assert(res.hasOwnProperty('driversObj'))
            // make sure no empty objs
            assert(
              !utils.isObjEmpty(res.teamsObj) &&
                !utils.isObjEmpty(res.driversObj)
            )
            teamsController.fetchTeamsAPI.restore()
          })
        }
      )
    })
    it('renderTeamTemplate returns correct template response object', function() {
      const mockCtx = {
        query: {
          team: 'red_bull_racing'
        },
        // fake render func
        render: function(templateName, options) {
          return
        }
      }
      sinon.spy(teamsController, 'compileTeamTemplateResObj')
      return teamsController.renderTeamTemplate(mockCtx).then(res => {
        // res obj that is sent with render
        const resObjOutput =
          teamsController.compileTeamTemplateResObj.returnValues[0]
        return teamsController.fetchTeamAPI(mockCtx, 'page').then(res => {
          const { driverData, teamData, driversObj, teamsObj } = res
          return Promise.resolve(driversObj).then(driversObj => {
            return Promise.resolve(teamsObj).then(teamsObj => {
              const template = teamsController.compileTeamTemplateResObj(
                mockCtx,
                driversObj,
                teamsObj,
                driverData,
                teamData
              )
              // compare direct call to template comiler and value given inside here
              // they should be equal if functions are all correct
              assert.deepEqual(resObjOutput, template)
              teamsController.compileTeamTemplateResObj.restore()
            })
          })
        })
      })
    })
    // TODO
    it.skip('calls fake endpoint', function() {
      // { request:
      //   { method: 'GET',
      //     url: '/driver?driver=alexander-albon',
      //     header:
      //      { host: 'localhost:3000',
      //        'user-agent': 'curl/7.54.0',
      //        accept: '*/*' } },
      //  response:
      //   { status: 404,
      //     message: 'Not Found',
      //     header: [Object: null prototype] {} },
      //  app: { subdomainOffset: 2, proxy: false, env: 'development' },
      //  originalUrl: '/driver?driver=alexander-albon',
      //  req: '<original node req>',
      //  res: '<original node res>',
      //  socket: '<original node socket>' }
      const ctx = {
        query: {
          driver: 'some-driver'
        }
      }
      return driversController.renderTeamTemplate(ctx).then(res => {
        console.log(res)
      })
    })
  })
})
