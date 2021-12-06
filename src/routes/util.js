let Util = {};
Util.map = function(a, b, c, d, e) {
  a = this.clamp(a, b, c);
  return (a - b) / (c - b) * (e - d) + d;
};
Util.clamp = function(value, min, max) {
  return Math.max(min, Math.min(max, value));
};
export {Util as default};
