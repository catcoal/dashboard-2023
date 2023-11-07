<script setup lang="ts">
import Editor from 'ckeditor5-custom-build';
import { EditorConfig } from '@ckeditor/ckeditor5-core/src/editor/editorconfig';
import { customUploadImage } from "./ckeditor";
import { ref } from 'vue';

const editorData = ref('');
const editor = Editor;
const editorConfig: EditorConfig = {
    extraPlugins: [customUploadImage as any],
    removePlugins: ["Title", "ImageInsert", "Style", "Essentials"],
    toolbar: {
        shouldNotGroupWhenFull: true
    }
}

const getData = () => {
    console.log(editorData.value)
}

const onReady = (editor: Editor) => {
}

</script>

<template>
    <div class="editor-container">
        <ckeditor @ready="onReady" :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
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