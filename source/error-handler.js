import { red } from 'kleur'
import { logcons } from 'logcons'

export function errorHandler (err) {
  const msg = (err.message || err || 'Unknown error').replace(
    /(\r?\n)/g,
    '$1      '
  )
  console.error(`${logcons.cross()} ${red().bold('depdown ')}${msg}`)
  process.exit(1)
}
