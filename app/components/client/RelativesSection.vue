<script setup>
import RelativesSectionHeader from '~/components/client/RelativesSectionHeader.vue'
import RelativesSectionLoading from '~/components/client/RelativesSectionLoading.vue'
import RelativesSectionError from '~/components/client/RelativesSectionError.vue'
import RelativesSectionEmpty from '~/components/client/RelativesSectionEmpty.vue'
import RelativesSectionList from '~/components/client/RelativesSectionList.vue'

const props = defineProps({
  relatives: {
    type: Array,
    default: () => []
  },
  loading: Boolean,
  error: String
})

const emit = defineEmits(['new', 'edit', 'delete'])
</script>

<template>
  <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <RelativesSectionHeader :relative-count="relatives.length" @new="emit('new')" />

    <div class="p-6">
      <RelativesSectionLoading v-if="loading" />
      <RelativesSectionError v-else-if="error" :error="error" />
      <RelativesSectionEmpty v-else-if="relatives.length === 0" @new="emit('new')" />
      <RelativesSectionList
        v-else
        :relatives="relatives"
        @edit="(relative) => emit('edit', relative)"
        @delete="(relative) => emit('delete', relative)"
      />
    </div>
  </div>
</template>
