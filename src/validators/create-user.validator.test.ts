import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import type { NextFunction, Request, Response } from 'express';
import validateCreateUser from './create-user.validator.ts';

type Captured = { status?: number; body?: unknown; nextCalled: boolean };

function run(payload: unknown): Captured {
    const captured: Captured = { nextCalled: false };

    const res = {
        status(code: number) {
            captured.status = code;
            return this;
        },
        json(body: unknown) {
            captured.body = body;
            return this;
        },
    } as unknown as Response;

    const req = { body: payload } as Request;
    const next = (() => {
        captured.nextCalled = true;
    }) as NextFunction;

    validateCreateUser(req, res, next);
    return captured;
}

function fieldErrors(captured: Captured): Record<string, string[] | undefined> {
    const body = captured.body as { errors: Record<string, string[] | undefined> };
    return body.errors;
}

describe('create-user validator', () => {
    const valid = {
        name: 'Osman',
        email: 'osman@example.com',
        password: 'correct horse',
        confirm: 'correct horse',
    };

    test('calls next() for a valid payload', () => {
        const captured = run(valid);

        assert.equal(captured.nextCalled, true);
        assert.equal(captured.status, undefined);
    });

    test('rejects a mismatched confirmation with a 400 on the confirm field', () => {
        const captured = run({ ...valid, confirm: 'different' });

        assert.equal(captured.nextCalled, false);
        assert.equal(captured.status, 400);
        assert.deepEqual(fieldErrors(captured).confirm, ['Password confirmation failed']);
    });

    test('reports field errors without a confirmation error when password is missing', () => {
        const { password: _password, ...withoutPassword } = valid;
        const captured = run(withoutPassword);

        assert.equal(captured.status, 400);
        assert.ok(fieldErrors(captured).password);
        assert.equal(fieldErrors(captured).confirm, undefined);
    });

    test('reports the invalid email rather than throwing', () => {
        const captured = run({ ...valid, email: 'not-an-email' });

        assert.equal(captured.status, 400);
        assert.ok(fieldErrors(captured).email);
    });
});
