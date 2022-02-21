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
or(T)(F) // T
or(F)(F) // F
M(T)(F) // T
M(F)(F) // F
// (λpq.ppq)xy
// = λxy.xxy
// = xxy
// Mxy == xxy

// Boolean Equality | λpq.p(q T F)(q F T) | λpq.p q(NOT(q))
// tests if p and q are equal
const beq = p => q => p(q(T)(F))(q(F)(T));
beq(T)(T) // T
beq(F)(T) // F
beq(F)(F) // T
