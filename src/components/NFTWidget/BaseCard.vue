<template>
  <div
    @click="$emit('click')"
    class="bg-white p-[16px] rounded-[16px] border-shade-gray border-[2px]"
  >
    <slot />
  </div>
</template>
