export const getRandomColor = () => {
  const letters = '9ABCDEF'.split('');
  let color = '';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
};

export const cartesian = (arg) => {
  const r = [];
  const max = arg.length - 1;
  function helper(arr, i) {
    const l = arg[i].values.length;
    for (let j = 0; j < l; j += 1) {
      const a = arr.slice(0); // clone arr
      a.push({
        name: arg[i].name,
        value: arg[i].values[j],
      });
      if (i === max) r.push(a);
      else helper(a, i + 1);
    }
  }
  helper([], 0);
  return r;
};
