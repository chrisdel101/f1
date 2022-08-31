exports.errorHandler = {
  renderDemoError: (driverNamesArr, teamsNamesArr) => {
    console.log(driverNamesArr, teamsNamesArr)
    if (!driverNamesArr?.length || !teamsNamesArr?.length) {
      throw new ReferenceError(
        'Error: renderDemoError is missing data. Check drivers + teams have DB data'
      )
    }
  },
  buildDriverCardError: (driverData, teamData) => {
    if (!driverData || !teamData) {
      throw new ReferenceError('buildDriverCardError: driver data is undefined')
    }
  },
  renderDriverCardError: (cxt) => {
    console.log('CTX', ctx)
    // if (!ctx.params) {
    //   console.error('renderDriverCardError: Invalid or missing query params')
    //   ctx.res.end = 'Missing'
    // }
  },
  queryTeamDataError: (teamData) => {
    if (!teamData) {
      throw new ReferenceError(
        'queryTeamDataError: queried team data is undefined'
      )
    }
  },
}
