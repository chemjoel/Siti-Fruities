// Minimal shim for d3-interpolate used by d3-scale in this project.
// Provides basic numeric interpolation and a rounding variant.
// This is intentionally small and only implements the features required by d3-scale usage in the bundle.

export function interpolate(a, b) {
  // If both are numbers, simple linear interpolation
  if (typeof a === 'number' && typeof b === 'number') {
    const delta = b - a;
    return function(t) {
      return a + delta * t;
    };
  }

  // Fallback: return a function that uses string concatenation for non-number types
  return function(t) {
    return t < 0.5 ? a : b;
  };
}

export function interpolateNumber(a, b) {
  // numeric interpolation for d3.scale usage
  const delta = (Number(b) || 0) - (Number(a) || 0);
  return function(t) {
    return (Number(a) || 0) + delta * t;
  };
}

export function interpolateRound(a, b) {
  const interp = interpolateNumber(a, b);
  return function(t) {
    return Math.round(interp(t));
  };
}

export function piecewise(interpolateFunction, values) {
  const count = values.length;
  if (count === 0) return () => undefined;
  if (count === 1) return () => values[0];

  const interpolators = values.slice(1).map((value, index) =>
    interpolateFunction(values[index], value),
  );

  return function(t) {
    if (t <= 0) return values[0];
    if (t >= 1) return values[count - 1];

    const position = t * (count - 1);
    const index = Math.floor(position);
    return interpolators[index](position - index);
  };
}

export default {
  interpolate,
  interpolateNumber,
  interpolateRound,
  piecewise,
};