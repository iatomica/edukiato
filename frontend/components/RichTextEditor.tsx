import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2 } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const NavButton = ({ isActive, onClick, children }: any) => (
        <button
            type="button"
            onClick={onClick}
            className={`p-1.5 rounded transition-colors ${isActive
                ? 'bg-primary-100 text-primary-700 font-semibold'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
        >
            {children}
        </button>
    );

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50 rounded-t-xl overflow-x-auto">
            <NavButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                title="Título Principal (H1)"
            >
                <Heading1 size={18} />
            </NavButton>
            <NavButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                title="Subtítulo (H2)"
            >
                <Heading2 size={18} />
            </NavButton>

            <div className="w-px h-5 bg-slate-200 mx-1"></div>

            <NavButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Negrita"
            >
                <Bold size={18} />
            </NavButton>
            <NavButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Cursiva"
            >
                <Italic size={18} />
            </NavButton>

            <div className="w-px h-5 bg-slate-200 mx-1"></div>

            <NavButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Lista con Viñetas"
            >
                <List size={18} />
            </NavButton>
            <NavButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Lista Numerada"
            >
                <ListOrdered size={18} />
            </NavButton>
        </div>
    );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[160px] p-4 text-slate-700 prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-a:text-primary-600 prose-ul:list-disc prose-ol:list-decimal prose-li:my-0.5 my-4',
            },
        },
    });

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white group focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-500 transition-all">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};
