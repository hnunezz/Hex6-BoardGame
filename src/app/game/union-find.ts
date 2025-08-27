export class UnionFind<T extends string | number> {
  private parent = new Map<T, T>();
  private rank = new Map<T, number>();

  makeSet(x: T) {
    if (!this.parent.has(x)) { this.parent.set(x, x); this.rank.set(x, 0); }
  }
  find(x: T): T {
    const p = this.parent.get(x);
    if (p === undefined) throw new Error('element not found');
    if (p !== x) this.parent.set(x, this.find(p));
    return this.parent.get(x)!;
  }
  union(a: T, b: T) {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return;
    const rra = this.rank.get(ra)!; const rrb = this.rank.get(rb)!;
    if (rra < rrb) this.parent.set(ra, rb);
    else if (rra > rrb) this.parent.set(rb, ra);
    else { this.parent.set(rb, ra); this.rank.set(ra, rra + 1); }
  }
}
