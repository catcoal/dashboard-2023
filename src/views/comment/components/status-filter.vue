<script setup lang="ts">
import { Segmented } from 'ant-design-vue';
import { SegmentedBaseOption } from 'ant-design-vue/es/segmented/src/segmented';
import { CommentStatus } from "@/api/comment";
import { computed } from 'vue';

const emit = defineEmits({
    change: (payload: string | number) => payload
})

const statusOptions = computed<SegmentedBaseOption[]>(
    () => Object.keys(CommentStatus).map(item => {
        return {
            value: item,
            payload: {
                label: CommentStatus[item as keyof typeof CommentStatus]
            }
        }
    }));

const change = (value: string | number) => {
    emit('change', value)
}
</script>

<template>
    <div class="status-filter">
        <Segmented @change="change" v-bind="$attrs" :options="statusOptions">
            <template #label="{ payload }">
                {{ payload.label }}
            </template>
        </Segmented>
    </div>
</template>

<style scoped>
.ant-segmented {
    background-color: #fafafa;
}
</style>