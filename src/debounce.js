export default function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    const onComplete = () => {
      fn.apply(this, args);
      timer = null;
    }

    if(timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(onComplete, delay);
  }
}