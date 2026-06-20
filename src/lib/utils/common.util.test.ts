import { HttpException } from '@/lib/error';
import { seq, type SeqHandlerInput } from '@/lib/utils/common.util';
import type { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

type TestCtx = {
  calls: string[];
};

function makeInput(): SeqHandlerInput<TestCtx> {
  return {
    req: {} as NextRequest,
    ctx: { calls: [] },
  };
}

describe('seq', () => {
  it('runs handlers in order when they do not return a response', async () => {
    const deal = seq<TestCtx>(
      ({ ctx }) => {
        ctx.calls.push('first');
      },
      ({ ctx }) => {
        ctx.calls.push('second');
      },
    );

    const input = makeInput();
    const res = await deal(input);

    expect(res).toBeUndefined();
    expect(input.ctx.calls).toEqual(['first', 'second']);
  });

  it('stops once a handler returns a response', async () => {
    const last = vi.fn();
    const response = Response.json({ ok: true });
    const deal = seq<TestCtx>(
      ({ ctx }) => {
        ctx.calls.push('first');
      },
      ({ ctx }) => {
        ctx.calls.push('second');
        return response;
      },
      last,
    );

    const input = makeInput();
    const res = await deal(input);

    expect(res).toBe(response);
    expect(input.ctx.calls).toEqual(['first', 'second']);
    expect(last).not.toHaveBeenCalled();
  });

  it('converts HttpException into an HTTP response', async () => {
    const deal = seq<TestCtx>(() => {
      throw new HttpException(401, 'Unauthorized', 'NO_AUTH');
    });

    const res = await deal(makeInput());

    expect(res).toBeInstanceOf(Response);
    expect(res?.status).toBe(401);
    await expect(res?.json()).resolves.toEqual({
      message: 'Unauthorized',
      code: 'NO_AUTH',
    });
  });

  it('rethrows non-HttpException errors', async () => {
    const deal = seq<TestCtx>(() => {
      throw new Error('boom');
    });

    await expect(deal(makeInput())).rejects.toThrow('boom');
  });
});
