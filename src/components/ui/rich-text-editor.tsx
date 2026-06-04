
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import DOMPurify from 'dompurify';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  disabled = false,
  className = '',
  placeholder = 'Write something...'
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[120px] max-h-[200px] w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm focus-visible:outline-none prose prose-sm max-w-none overflow-y-auto',
        placeholder,
      },
    },
  });

  // When the value prop changes externally, update the editor content
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Wait until client-side to render to avoid hydration issues
  if (!isMounted) {
    return <div className={`min-h-[120px] max-h-[200px] ${className} border border-input rounded-md bg-background px-3 py-2`} />;
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <div className="border border-input rounded-md bg-background overflow-hidden max-h-[250px] flex flex-col">
        <div className="flex flex-wrap gap-1 p-1 border-b border-input bg-muted/50 flex-shrink-0">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`p-2 text-xs rounded hover:bg-muted ${editor?.isActive('bold') ? 'bg-muted' : ''}`}
            disabled={disabled}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`p-2 text-xs rounded hover:bg-muted ${editor?.isActive('italic') ? 'bg-muted' : ''}`}
            disabled={disabled}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`p-2 text-xs rounded hover:bg-muted ${editor?.isActive('bulletList') ? 'bg-muted' : ''}`}
            disabled={disabled}
          >
            Bullet List
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`p-2 text-xs rounded hover:bg-muted ${editor?.isActive('orderedList') ? 'bg-muted' : ''}`}
            disabled={disabled}
          >
            Numbered List
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} className="p-0" />
        </div>
      </div>
    </div>
  );
}

// Helper function to sanitize HTML content
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'br'],
    ALLOWED_ATTR: [],
  });
};
