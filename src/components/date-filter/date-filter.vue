<script setup lang="ts">
import { Segmented } from 'ant-design-vue';
import { SegmentedBaseOption } from 'ant-design-vue/es/segmented/src/segmented';
import { reactive } from 'vue';
import { ThemeColor } from '@/config/app';

const emit = defineEmits({
    change: (payload: string | number) => payload
})
const data = reactive<SegmentedBaseOption[]>([
    {
        value: 1,
        payload: {
            label: "24H"
        }
    },
    {
        value: 7,
        payload: {
            label: "本周"
        }
    },
    {
        value: 30,
        payload: {
            label: "本月"
        }
    },
    {
        value: 0,
        payload: {
            label: "全部"
        }
    }]);
const change = (value: string | number) => {
    emit('change', value)
}

</script>

<template>
    <div class="date-filter">
        <Segmented @change="change" v-bind="$attrs" :options="data">
            <template #label="{ payload }">
                <p>{{ payload.label }}</p>
            </template>
        </Segmented>
    </div>
</template>

<style scoped>
.ant-segmented {
    background-color: #fafafa;
}

:deep(.ant-segmented-item-selected .ant-segmented-item-label) {
    color: v-bind(ThemeColor);
}
</style>