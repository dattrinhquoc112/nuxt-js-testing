<template>
  <div class="total--capacity">
    <div class="total--usage" :style="{ width: `${widthOfTotalUsage}%` }"></div>

    <div
      class="total--usage-project"
      :style="{ width: `${widthOfTotalProjectUsage}%` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  totalCapacity: {
    type: Number,
    default: 0,
    required: true,
  },
  totalUsage: {
    type: Number,
    default: 0,
    required: true,
  },
  totalUsageInProject: {
    type: Number,
    default: 0,
    required: true,
  },
});
const widthOfTotalUsage = computed(() => {
  return (props.totalUsage / props.totalCapacity) * 100;
});

const widthOfTotalProjectUsage = computed(() => {
  return (props.totalUsageInProject / props.totalCapacity) * 100;
});
</script>
<style lang="scss" scoped>
.total {
  &--capacity {
    width: 100%;
    background-color: $neutral-white-alpha-7;
    height: 6px;
    position: relative;
    z-index: 1;
  }
  &--usage {
    background-color: $neutral-white-alpha-80;
    height: 6px;
    position: absolute;
    z-index: 2;
  }
  &--usage-project {
    width: 60%;
    background-color: $brand-green-200-main;
    height: 6px;
    position: absolute;
    z-index: 3;
  }
}
</style>
