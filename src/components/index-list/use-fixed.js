import { ref, watch, nextTick, computed } from "vue";
export default function useFixed(props) {
  const groupRef = ref(null);

  const listHeights = ref([]);

  const scrollY = ref(0);

  const currentIndex = ref(0);

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return "";
    }
    const currentGroup = props.data[currentIndex.value];
    // 加一个保护 验证是否存在
    return currentGroup ? currentGroup.title : "";
  });

  //   数据发生变化后 计算标签对应内容高度
  //   监视reactive定义的响应式数据中的某个属性 应该如下方式 ()=>xx.params
  watch(
    () => props.data,
    async () => {
      //   借用nextTick 确保在无下一次dom数据更新时再调用calculate 确保获取到正确的高度
      await nextTick();
      calculate();
    }
  );

  //   监听scrollY的变化
  watch(scrollY, (newY) => {
    const listHeightVal = listHeights.value;
    // 找出具体在哪个区间
    for (let index = 0; index < listHeightVal.length - 1; index++) {
      const heightTop = listHeightVal[index];
      const heightBottom = listHeightVal[index + 1];

      // 当前的scrollY在循环到的这个区间内
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = index;
      }
    }
  });

  //   计算不同标签对应内容所在的高度 并将其存入listHeights中
  // 如   A-----0px
  //         人名1
  //         人名2
  //      B-----60px
  function calculate() {
    const list = groupRef.value.children;
    const listHeightVal = listHeights.value;
    listHeights.value.length = 0;
    let height = 0;

    listHeightVal.push(height);

    // debugger;
    for (let index = 0; index < list.length; index++) {
      height += list[index].clientHeight;
      listHeightVal.push(height);
    }
  }

  //   不要疑惑  是负值
  function onScroll(pos) {
    scrollY.value = -pos.y;
  }
  return {
    groupRef,
    onScroll,
    fixedTitle,
    currentIndex,
  };
}
