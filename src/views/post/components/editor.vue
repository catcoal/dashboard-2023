<script setup lang="ts">
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { VNodeRef, onMounted, ref, reactive } from "vue";

const editor = ref<VNodeRef>();
const quillInstance = ref<Quill | null>(null); // 使用 ref 包装 Quill 实例

onMounted(() => {
    quillInstance.value = new Quill(editor.value as string, {
        theme: "snow", // 根据需要选择主题
        modules: {
            toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                ["link"],
                ["image", "blockquote", "code-block"],
                [{ list: "ordered" }, { list: "bullet" }],
            ]
        },
    });
});

</script>

<template>
    <div class="editor-container">
        <div ref="editor">

        </div>
    </div>
</template>

<style scoped>
:deep(.ql-toolbar.ql-snow) {
    border-radius: 10px 10px 0 0;
}

:deep(.ql-container.ql-snow) {
    border-radius: 0 0 10px 10px;
    min-height: 100px;
    background-color: #FFF;
}

:deep(.ql-editor) {
    min-height: 100px;
}
</style>