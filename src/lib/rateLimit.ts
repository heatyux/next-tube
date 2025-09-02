import { Ratelimit } from '@upstash/ratelimit'

import { redis } from './redis'

export const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '10s'),
})
