<template>
  <div
    class="bg-white p-[16px] rounded-[16px] border-shade-gray border-[2px]"
    @click="$emit('click')"
  >
    <slot />
  </div>
</template>
