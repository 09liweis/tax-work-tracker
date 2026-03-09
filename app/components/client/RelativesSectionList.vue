<script setup>
const props = defineProps({
  relatives: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="space-y-3">
    <RelativeCard
      v-for="relative in relatives"
      :key="relative._id"
      :relative="relative"
      @edit="emit('edit', relative)"
      @delete="emit('delete', relative)"
    />
  </div>
</template>
