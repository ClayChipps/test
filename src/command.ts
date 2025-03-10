import {Interfaces, toStandardizedId} from '@oclif/core'

import {loadConfig} from './load-config'

const castArray = <T>(input?: T | T[]): T[] => {
  if (input === undefined) return []
  return Array.isArray(input) ? input : [input]
}

type Context = {config: Interfaces.Config; expectation: string; returned: unknown}

export function command(
  args: string | string[],
  opts: loadConfig.Options = {},
): {
  run(ctx: Context): Promise<void>
} {
  return {
    async run(ctx: Context) {
      if (!ctx.config || opts.reset) ctx.config = await loadConfig(opts).run({} as Context)
      args = castArray(args)
      const [id, ...extra] = args
      const cmdId = toStandardizedId(id, ctx.config)
      ctx.expectation = ctx.expectation || `runs ${args.join(' ')}`
      await ctx.config.runHook('init', {argv: extra, id: cmdId})
      ctx.returned = await ctx.config.runCommand(cmdId, extra)
    },
  }
}
