export function addClass(el, className) {
  // 不需要样式重复添加 使用contains做判断
  if (!el.classList.contains(className)) {
    el.classList.add(className);
  }
}

export function removeClass(el, className) {
  // remove则不需要 反正不会报错
  el.classList.remove(className);
}
