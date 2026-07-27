<template>
  <div class="rich-text-editor border border-gray-300 rounded-lg overflow-hidden">
    <!-- Toolbar -->
    <div v-if="editor" class="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-300">
      <!-- Text Style -->
      <button
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'bg-primary-100 text-primary-700': editor.isActive('bold') }"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors"
        title="بولد"
      >
        <i class="pi pi-bold"></i>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'bg-primary-100 text-primary-700': editor.isActive('italic') }"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors"
        title="ایتالیک"
      >
        <i class="pi pi-italic"></i>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'bg-primary-100 text-primary-700': editor.isActive('strike') }"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors"
        title="خط‌خورده"
      >
        <i class="pi pi-minus-circle"></i>
      </button>

      <div class="w-px h-6 bg-gray-300 mx-1"></div>

      <!-- Headings -->
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'bg-primary-100 text-primary-700': editor.isActive('heading', { level: 2 }) }"
        class="px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors font-bold"
        title="تیتر ۲"
      >
        H2
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'bg-primary-100 text-primary-700': editor.isActive('heading', { level: 3 }) }"
        class="px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors font-bold"
        title="تیتر ۳"
      >
        H3
      </button>

      <div class="w-px h-6 bg-gray-300 mx-1"></div>

      <!-- Lists -->
      <button
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-primary-100 text-primary-700': editor.isActive('bulletList') }"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors"
        title="لیست نقطه‌ای"
      >
        <i class="pi pi-list"></i>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-primary-100 text-primary-700': editor.isActive('orderedList') }"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors"
        title="لیست شماره‌دار"
      >
        <i class="pi pi-hashtag"></i>
      </button>

      <div class="w-px h-6 bg-gray-300 mx-1"></div>

      <!-- Block -->
      <button
        type="button"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'bg-primary-100 text-primary-700': editor.isActive('blockquote') }"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors"
        title="نقل‌قول"
      >
        <i class="pi pi-quote"></i>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().setHorizontalRule().run()"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors"
        title="خط افقی"
      >
        <i class="pi pi-minus"></i>
      </button>

      <div class="w-px h-6 bg-gray-300 mx-1"></div>

      <!-- Alignment -->
      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('right').run()"
        :class="{ 'bg-primary-100 text-primary-700': editor.isActive({ textAlign: 'right' }) }"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors"
        title="راست‌چین"
      >
        <i class="pi pi-align-right"></i>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('center').run()"
        :class="{ 'bg-primary-100 text-primary-700': editor.isActive({ textAlign: 'center' }) }"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors"
        title="وسط‌چین"
      >
        <i class="pi pi-align-center"></i>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('left').run()"
        :class="{ 'bg-primary-100 text-primary-700': editor.isActive({ textAlign: 'left' }) }"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors"
        title="چپ‌چین"
      >
        <i class="pi pi-align-left"></i>
      </button>

      <div class="w-px h-6 bg-gray-300 mx-1"></div>

      <!-- Link -->
      <button
        type="button"
        @click="setLink"
        :class="{ 'bg-primary-100 text-primary-700': editor.isActive('link') }"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors"
        title="لینک"
      >
        <i class="pi pi-link"></i>
      </button>

      <!-- Image -->
      <button
        type="button"
        @click="addImage"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors"
        title="تصویر"
      >
        <i class="pi pi-image"></i>
      </button>

      <div class="w-px h-6 bg-gray-300 mx-1"></div>

      <!-- Undo/Redo -->
      <button
        type="button"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().undo()"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors disabled:opacity-30"
        title="برگردان"
      >
        <i class="pi pi-replay"></i>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().redo()"
        class="p-1.5 rounded hover:bg-gray-200 transition-colors disabled:opacity-30"
        title="انجام مجدد"
      >
        <i class="pi pi-forward"></i>
      </button>
    </div>

    <!-- Editor Content -->
    <EditorContent :editor="editor" class="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none [&_.ProseMirror]:min-h-[280px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]" />

    <!-- Link Modal -->
    <Dialog v-model:visible="linkModalVisible" header="افزودن لینک" modal class="w-96">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">آدرس لینک</label>
          <input v-model="linkUrl" type="url" placeholder="https://example.com" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
        </div>
      </div>
      <template #footer>
        <Button label="لغو" severity="secondary" @click="linkModalVisible = false" />
        <Button label="ذخیره" @click="confirmLink" />
      </template>
    </Dialog>

    <!-- Image Modal -->
    <Dialog v-model:visible="imageModalVisible" header="افزودن تصویر" modal class="w-96">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">آدرس تصویر</label>
          <input v-model="imageUrl" type="url" placeholder="https://example.com/image.jpg" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
        </div>
      </div>
      <template #footer>
        <Button label="لغو" severity="secondary" @click="imageModalVisible = false" />
        <Button label="ذخیره" @click="confirmImage" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  placeholder: 'محتوای مقاله را بنویسید...',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const linkModalVisible = ref(false)
const linkUrl = ref('')
const imageModalVisible = ref(false)
const imageUrl = ref('')

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [2, 3],
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary-600 underline cursor-pointer',
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'rounded-lg max-w-full h-auto my-4',
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
  ],
  editorProps: {
    attributes: {
      dir: 'rtl',
      class: 'focus:outline-none min-h-[280px]',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(() => props.modelValue, (value) => {
  if (editor.value && editor.value.getHTML() !== value) {
    editor.value.commands.setContent(value, { emitUpdate: false })
  }
})

function setLink() {
  linkUrl.value = editor.value?.getAttributes('link').href || ''
  linkModalVisible.value = true
}

function confirmLink() {
  if (!editor.value) return

  if (linkUrl.value) {
    editor.value.chain().focus().extendMarkRange('link').setLink({ href: linkUrl.value }).run()
  } else {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
  }
  linkModalVisible.value = false
  linkUrl.value = ''
}

function addImage() {
  imageUrl.value = ''
  imageModalVisible.value = true
}

function confirmImage() {
  if (!editor.value || !imageUrl.value) return
  editor.value.chain().focus().setImage({ src: imageUrl.value }).run()
  imageModalVisible.value = false
  imageUrl.value = ''
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
.tiptap {
  outline: none;
}

.tiptap p.is-editor-empty:first-child::before {
  color: #9ca3af;
  content: attr(data-placeholder);
  float: right;
  height: 0;
  pointer-events: none;
}

.tiptap blockquote {
  border-right: 4px solid #d68020;
  padding-right: 1rem;
  margin-right: 0;
  color: #6b7280;
  font-style: italic;
}

.tiptap ul {
  list-style-type: disc;
  padding-right: 1.5rem;
}

.tiptap ol {
  list-style-type: decimal;
  padding-right: 1.5rem;
}

.tiptap h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.tiptap h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

.tiptap hr {
  border-color: #e5e7eb;
  margin: 1.5rem 0;
}

.tiptap img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.tiptap a {
  color: #d68020;
  text-decoration: underline;
  cursor: pointer;
}

.tiptap a:hover {
  color: #a65114;
}
</style>
