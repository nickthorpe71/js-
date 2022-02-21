// --- Combinators --- \\
// Combinators are functions with no free variables. 
// This means the variables in the function body are bound to a parameter
// λb.b is a combinator
// λab.b is a combinator (not all parameters need to be used)
// λb.a is not because a is not bound to a parameter
// λb.ba is not because a is not bound to a parameter


// - Identity | λa.a -
// Returns itself.
const I = a => a;


// - Mockingbird | λf.ff -
// Takes a function as input and invokes that function passing in itself.
// "self application combinator"
const M = f => f(f);

M(I);
// This would be equal to I I in lambda calc or  I(I) in JS.


// - Kestrel | λab.a -
// Takes two things and returns the first one.
const K = a => b => a;

// Example of making a constant 5.
const K5 = K(5);
K5(9); // == 5;
K5(523434); // == 5;


// - Kite | λab.b -
// K I with two arguments returns the second argument.
K(I)(x)(y) === I(y); // derived from a Kestrel and Identity
// Can also be written independently.
const KI = a => b => b;
// Is like the opposite of the Kestrel.


// - Cardinal | λfab.fba -
// Takes function f and calls it with flipped parameters.
// Flips arguments.
const C = f => a => b => f(b)(a);

// These produce the same result
C(K)(I)(M) // == M
KI(I)(M) // == M


// - Bluebird | λfga.f(ga) -
// AKA: function composition
const B = f => g => a => f(g(a));
B(not)(not)(T); // T
// take the successor of church numeral n3 (successor function applied to identity twice)
// and turn it into a js number
B(jsnum)(succ)(n3); // 4

// - Thrush | λaf.fa -
const Thrush = a => f => f(a);

// Vereo | Pair | Closure | λabf.fab | BCT
// Takes two arguments and holds onto them
// waiting for a third argument which is a function 
// that it can apply to the first two arguments
const V = a => b => f => f(a)(b);


// - Blackbird | λfgab.f(gab) | BBB
const B1 = f => g => a => b => f(g)(a)(b); // * need to double check this


// --- Church Encodings --- \\

// - Booleans - 
// True = K
// False = KI = C K
const T = K;
const F = KI;


// NOT | Negation | λp.pTF == Cardinal
// Whichever boolean (p) is passed in will select it's opposite
const not = p => p(F)(T);
not(T); // returns F
C(T); // returns a function that returns F


// AND | Conjunction | λpq.pqp | λpq.pqF 
const and = p => q => p(q)(p);
and(T)(F); // F
and(T)(T); // T


// OR | Disjunction | λpq.ppq | λpq.pTq | M* (mocking bird once removed)
const or = p => q => p(p)(q);
or(T)(F); // T
or(F)(F); // F
M(T)(F); // T
M(F)(F); // F
// (λpq.ppq)xy
// = λxy.xxy
// = xxy
// Mxy == xxy


// Boolean Equality | λpq.p(q T F)(q F T) | λpq.p q(NOT(q))
// tests if p and q are equal
const beq = p => q => p(q(T)(F))(q(F)(T));
beq(T)(T); // T
beq(F)(T); // F
beq(F)(F); // T



// - Numerals -

// One | λfa.fa
// Takes a function and an argument and calls that function on that argument once.
const once = f => a => f(a);
once(I)(2); // 2
once(not)(T); // F
// = not(T)

// Two | λfa.f(fa)
// Takes a function and an argument and calls that function on that argument twice.
const twice = f => a => f(f(a));
twice(not)(F); // F
// = not(not(T))

// Three | λfa.f(f(fa))
// Takes a function and an argument and calls that function on that argument three times.
const thrice = f => a => f(f(f(a)));
twice(not)(F); // T
// = not(not(not(T)))

// And so forth...

// Zero | λfa.a
// Applies f to a no times.
const zero = f => a => a;
// zero = F = False = KI = C K
zero(not)(T); // T
F(not)(T); // T


// Successor | λnfa.f(nfa)
// Add one.
// Takes a church numeral and adds one extra application of f
const succ = n => f => a => f(n(f)(a));
succ(zero) // returns once function
succ(zero)(not)(T) // F
// jsnum converts church numbers into js numbers
const jsnum = n => n(x => x + 1)(0);
jsnum(succ(zero)); // 1
jsnum(succ(thrice)); // 4
jsnum(twice); // 2
jsnum(succ(succ(succ(zero)))); // 3 -- basically count from 0 to 3
const n0 = zero;
const n1 = once;
const n2 = succ(n1);
const n3 = succ(n2);
jsnum(succ(n3)); // 4


// ADD (takes two church numerals) | λnk.n succ k
const add = n => k => n(succ)(k);
jsnum(add(n1)(n3)); // 4


// MULT (takes two church numerals) | λnkf.n(kf)
// multiplication is just the composition of church numerals
const mult = B;
jsnum(mult(n2)(n3)); // 6


// POW | λnk.kn | Thrush | CI
// Equal to the Thrush combinator
const pow = n => k => k(n);
jsnum(pow(3)(2)); // 9



// --- Data Structures --- \\

// Vereo | Pair | Closure | λabf.fab | BCT
// Takes two arguments and holds onto them
const V = a => b => f => f(a)(b);
V(I)(M); // f => f(I)(M)
V(I)(M)(K); // f => f(I)(M)(K) === I
const vim = V(I)(M); // which now waits to be passed a function to apply to I and M
vim(K); // === I
vim(KI); // === M
// Examples: where p is a piar/vereo
const first = p => p(K);
const second = p => p(KI);
first(vim); // == I
second(vim); // == M


// Is0 | is zero | λn.n (KF) T
const is0 = n => n(K(F))(T);
is0(n0); // T
is0(n2); // F


// PHI 
// Takes a pair and pairs together the second of the pair
// along with the successor of the second of the pair
const phi = p => V(second(p))(succ(second(p)));
jsnum(first(phi(V(n0, n3)))); // 3


// PRED | Subtract One | Predecessor 
const pred = n => first(n(phi)(V(n0)(n0)));
jsnum(pred(n3)); // 2


// Subtraction | λnk.k PRED n
// subtract one church numeral from another
const sub = n => k => k(pred)(n)


// LEQ | Less than or equal to | λnk.Is0 (SUB n k)
const leq = n => k => is0(sub(n)(k));


// EQ | Equality | λnk.AND(LEQ n k)(LEQ k n)
const eq = n => k => and(leq(n)(k))(leq(k)(n));


// GT | Greater than | λnk.NOT (LEQ n k)
const gt = n => k => not(leq(n)(k));
// could also be gt = B1(not)(leq)


