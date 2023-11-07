/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { Alignment } from "@ckeditor/ckeditor5-alignment";
import { Autosave } from "@ckeditor/ckeditor5-autosave";
import {
  Bold,
  Code,
  Italic,
  Strikethrough,
  Underline,
} from "@ckeditor/ckeditor5-basic-styles";
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote";
import { CodeBlock } from "@ckeditor/ckeditor5-code-block";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { FindAndReplace } from "@ckeditor/ckeditor5-find-and-replace";
import { FontColor, FontFamily } from "@ckeditor/ckeditor5-font";
import { Heading, Title } from "@ckeditor/ckeditor5-heading";
import { Highlight } from "@ckeditor/ckeditor5-highlight";
import {
  GeneralHtmlSupport,
  HtmlComment,
} from "@ckeditor/ckeditor5-html-support";
import {
  AutoImage,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
} from "@ckeditor/ckeditor5-image";
import { AutoLink, Link, LinkImage } from "@ckeditor/ckeditor5-link";
import { List, ListProperties, TodoList } from "@ckeditor/ckeditor5-list";
import { Markdown } from "@ckeditor/ckeditor5-markdown-gfm";
import { MediaEmbed, MediaEmbedToolbar } from "@ckeditor/ckeditor5-media-embed";
import { Mention } from "@ckeditor/ckeditor5-mention";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { RemoveFormat } from "@ckeditor/ckeditor5-remove-format";
import { StandardEditingMode } from "@ckeditor/ckeditor5-restricted-editing";
import { SourceEditing } from "@ckeditor/ckeditor5-source-editing";
import { Style } from "@ckeditor/ckeditor5-style";
import { SimpleUploadAdapter } from "@ckeditor/ckeditor5-upload";
import { WordCount } from "@ckeditor/ckeditor5-word-count";
declare class Editor extends ClassicEditor {
  static builtinPlugins: (
    | typeof Alignment
    | typeof AutoImage
    | typeof AutoLink
    | typeof Autosave
    | typeof BlockQuote
    | typeof Bold
    | typeof Code
    | typeof CodeBlock
    | typeof Essentials
    | typeof FindAndReplace
    | typeof FontColor
    | typeof FontFamily
    | typeof GeneralHtmlSupport
    | typeof Heading
    | typeof Highlight
    | typeof HtmlComment
    | typeof Image
    | typeof ImageCaption
    | typeof ImageInsert
    | typeof ImageResize
    | typeof ImageStyle
    | typeof ImageToolbar
    | typeof ImageUpload
    | typeof Italic
    | typeof Link
    | typeof LinkImage
    | typeof List
    | typeof ListProperties
    | typeof Markdown
    | typeof MediaEmbed
    | typeof MediaEmbedToolbar
    | typeof Mention
    | typeof Paragraph
    | typeof RemoveFormat
    | typeof SimpleUploadAdapter
    | typeof SourceEditing
    | typeof StandardEditingMode
    | typeof Strikethrough
    | typeof Style
    | typeof Title
    | typeof TodoList
    | typeof Underline
    | typeof WordCount
  )[];
  static defaultConfig: {
    toolbar: {
      items: string[];
    };
    language: string;
    image: {
      toolbar: string[];
    };
  };
}
export default Editor;
