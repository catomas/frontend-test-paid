const luhnChk = ((arr) => (ccNum: string) => {
  let len = ccNum.length;
  let bit = 1;
  let sum = 0;
  let val;

  while (len) {
    val = parseInt(ccNum.charAt(--len), 10);
    sum += (bit ^= 1) ? arr[val] : val;
  }

  return sum % 10 === 0;
})([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]);

export default luhnChk;
