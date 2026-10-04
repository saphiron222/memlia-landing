import assert from 'node:assert/strict';
import test from 'node:test';
import { parse, stringify, uneval } from 'devalue';
import fastUri from 'fast-uri';

test('serialization does not expose bytes outside a Node Buffer view', () => {
  // A private sentinel outside the view must not survive either serializer.
  const backing = Buffer.from([91, 92, 1, 2, 93, 94]);
  const view = backing.subarray(2, 4);
  const roundTrips = [parse(stringify(view)), Function(`return (${uneval(view)})`)()];
  for (const restored of roundTrips) {
    assert.deepEqual([...restored], [1, 2]);
    assert.equal(restored.buffer.byteLength, view.byteLength);
  }
});

test('percent-encoded host octets follow the same case normalization as plain hosts', () => {
  const plain = '//example.com/CaseSensitive?token=KeepCase';
  const encoded = '//%45XAMPLE.com/CaseSensitive?token=KeepCase';
  assert.equal(fastUri.parse(encoded).host, fastUri.parse(plain).host);
  assert.equal(fastUri.normalize(encoded), fastUri.normalize(plain));
  assert.equal(fastUri.equal(encoded, plain), true);
  assert.equal(fastUri.equal(encoded, '//example.com/casesensitive?token=KeepCase'), false);
});
