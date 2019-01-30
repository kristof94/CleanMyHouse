const { DateTime } = require('luxon')

exports.formatDescriptionFromOrder = function formatDescriptionFromOrder(
  order
) {
  const time = DateTime.fromMillis(order.time, { zone: 'Europe/Paris' })
  const date = DateTime.fromMillis(order.date, { zone: 'Europe/Paris' })
  const hour = time.hour
  const minute = time.minute == 30 ? 0.5 : 0
  const dateStr = `Date : ${date
    .setLocale('fr')
    .toLocaleString(DateTime.DATE_SHORT)}`
  const hourStr = `heure : ${hour}`
  const minuteStr = `minute : ${minute}`
  return `${dateStr}\n${hourStr}\n${minuteStr}`
}
