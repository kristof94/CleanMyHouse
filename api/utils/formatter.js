const { DateTime, Settings } = require('luxon')
Settings.defaultLocale = 'fr'
Settings.defaultZoneName = 'Europe/Paris'

exports.formatDescriptionFromOrder = function formatDescriptionFromOrder(
  order
) {
  const time = DateTime.fromMillis(order.time)
  const date = DateTime.fromMillis(order.date)
  const hour = time.hour
  const minute = time.minute == 30 ? 0.5 : 0
  const dateStr = `Date : ${date
    .setLocale('fr')
    .toLocaleString(DateTime.DATE_SHORT)}`
  const hourStr = `heure : ${hour}`
  const minuteStr = `minute : ${minute}`
  return `${dateStr}\n${hourStr}\n${minuteStr}`
}
