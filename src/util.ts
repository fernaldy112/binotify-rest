function isValidId(id: string): boolean {
  return /^\d+$/.test(id) && +id != 0;
}

function anyOf(...preds: boolean[]) {
  return new AnyOf(preds);
}

function allOf(...preds: boolean[]) {
  return new AnyOf(preds, true);
}

class AnyOf {
  constructor(private preds: boolean[], private inverted: boolean = false) {}

  is(value: boolean) {
    if (this.inverted) {
      value = !value;
    }

    for (const pred of this.preds) {
      if (pred === value) {
        return !this.inverted;
      }
    }

    return this.inverted;
  }
}

export { isValidId, anyOf, allOf };
