module.exports = robot => {
  robot.hear(/help/i, null, response => {
    const helps = robot.commands.map(command => {
      return command.help ? command.help : null
    }).filter(command => { return command != null })
    response.send(helps.join("\n"))
  })
}
