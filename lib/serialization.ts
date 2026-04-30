/**
 * Polyfill to support BigInt serialization in JSON.stringify.
 * This is required for Next.js Server Actions and API routes that return BigInt values.
 */
if (!(BigInt.prototype as any).toJSON) {
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
}

export {};
