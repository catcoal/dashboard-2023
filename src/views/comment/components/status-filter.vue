<script setup lang="ts">
import { Segmented } from 'ant-design-vue';
import { SegmentedBaseOption } from 'ant-design-vue/es/segmented/src/segmented';
import { CommentStatus } from "@/api/comment";
import { computed } from 'vue';
import { ThemeColor } from '@/config/app';
import { ref } from 'vue';
import { onMounted } from 'vue';

const emit = defineEmits({
    change: (payload: string | number) => payload
})

const statusOptions = ref<SegmentedBaseOption[]>([{
    value: "",
    payload: {
        label: "全部"
    }
}]);

onMounted(() => {
    let commentStatus: SegmentedBaseOption[] = Object.keys(CommentStatus).map(item => {
        return {
            value: item,
            payload: {
                label: CommentStatus[item as keyof typeof CommentStatus]
            }
        }
    });
    statusOptions.value.push(...commentStatus);
})

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
:deep(.ant-segmented-item-selected .ant-segmented-item-label) {
    color: v-bind(ThemeColor);
}

.ant-segmented {
    background-color: #fafafa;
}
</style>