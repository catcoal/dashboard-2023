<script setup lang="ts">
import Editor from 'ckeditor5-custom-build';
import { EditorConfig } from '@ckeditor/ckeditor5-core/src/editor/editorconfig';
import { customUploadImage } from "./ckeditor";
import { ref } from 'vue';

export interface backData {
    type: 'image' | 'text',
    data: any
}
const emit = defineEmits({
    output(payload: backData) {
        return payload
    }
});
const editorData = ref();
const editor = Editor;
const editorConfig: EditorConfig = {
    removePlugins: ["Title"],
    toolbar: {
        shouldNotGroupWhenFull: true
    }
}

const onReady = (editor: Editor) => {
    customUploadImage(editor);
    onUploadImage(editor);
}

// 监听上传图片
const onUploadImage = (editor: Editor) => {
    // 文档：https://ckeditor.com/docs/ckeditor5/latest/api/module_image_imageupload_imageuploadediting-ImageUploadEditing.html#event-uploadComplete
    editor.plugins.get('ImageUploadEditing').on('uploadComplete', (e, { data, imageElement }) => {
        emit('output', {
            type: 'image',
            data
        })
    })
}

</script>

<template>
    <div class="editor-container">
        <ckeditor v-bind="$attrs" @ready="onReady" :editor="editor" :config="editorConfig"></ckeditor>
    </div>
</template>

<style>
.editor-container * {
    list-style: revert;
    margin: revert;
    padding: revert;
}
</style>

<style scoped>
:deep(.ck.ck-toolbar) {
    border-radius: 10px 10px 0 0 !important;
}

:deep(.ck.ck-editor__main>.ck-editor__editable) {
    border-radius: 0 0 10px 10px !important;
}

:deep(.ck.ck-editor__main>.ck-editor__editable.ck-focused) {
    border: 1px solid #53b672 !important;
}

:deep(.ck.ck-content) {
    min-height: 400px;
}
</style>