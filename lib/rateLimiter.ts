type Bucket = {
  tokens: number;
  lastRefill: number;
};

const buckets = new Map<string, Bucket>();

const CAPACITY = 2; // maximum tokens
const REFILL_RATE = 1; // tokens added
const REFILL_INTERVAL = 6000; // every 6 seconds

export function consumeToken(request: Request) {
  const now = Date.now();
  const key: string =
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "anonymous"; // or some other unique identifier

  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = {
      tokens: CAPACITY,
      lastRefill: now,
    };

    buckets.set(key, bucket);
  }

  // Calculate how many tokens should be added
  const elapsed = now - bucket.lastRefill;
  const tokensToAdd = Math.floor(elapsed / REFILL_INTERVAL);

  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(CAPACITY, bucket.tokens + tokensToAdd);

    bucket.lastRefill += tokensToAdd * REFILL_INTERVAL;
  }

  // Reject request if no tokens remain
  if (bucket.tokens <= 0) {
    return {
      success: false,
      remaining: 0,
    };
  }

  // Consume one token
  bucket.tokens--;

  return {
    success: true,
    remaining: bucket.tokens,
  };
}
