import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false }),
            Image,
        ],
        content: value,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && !editor.isFocused) {
            const current = editor.getHTML();
            if (current !== value) {
                editor.commands.setContent(value, { emitUpdate: false });
            }
        }
    }, [value, editor]);

    const btn = (active: boolean) =>
        `px-2 py-1 rounded text-sm ${active ? "bg-[#2DE3A7] text-black" : "text-white hover:bg-[#1E2826]"}`;

    return (
        <div className="rounded-lg border border-[#1E2826] bg-[#0C1311] text-white">
            <div className="flex flex-wrap gap-1 border-b border-[#1E2826] p-2">
                {/* Headings */}
                {([1, 2, 3] as const).map((level) => (
                    <button
                        key={level}
                        type="button"
                        onClick={() =>
                            editor
                                ?.chain()
                                .focus()
                                .toggleHeading({ level })
                                .run()
                        }
                        className={btn(
                            !!editor?.isActive("heading", { level })
                        )}
                    >
                        H{level}
                    </button>
                ))}

                <span className="mx-1 border-l border-[#1E2826]" />

                {/* Inline marks */}
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={btn(!!editor?.isActive("bold"))}
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={btn(!!editor?.isActive("italic"))}
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor?.chain().focus().toggleUnderline().run()
                    }
                    className={btn(!!editor?.isActive("underline"))}
                >
                    U
                </button>

                <span className="mx-1 border-l border-[#1E2826]" />

                {/* Lists */}
                <button
                    type="button"
                    onClick={() =>
                        editor?.chain().focus().toggleOrderedList().run()
                    }
                    className={btn(!!editor?.isActive("orderedList"))}
                >
                    OL
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor?.chain().focus().toggleBulletList().run()
                    }
                    className={btn(!!editor?.isActive("bulletList"))}
                >
                    UL
                </button>

                <span className="mx-1 border-l border-[#1E2826]" />

                {/* Link */}
                <button
                    type="button"
                    onClick={() => {
                        const url = window.prompt("URL");
                        if (url)
                            editor
                                ?.chain()
                                .focus()
                                .setLink({ href: url })
                                .run();
                    }}
                    className={btn(!!editor?.isActive("link"))}
                >
                    Link
                </button>

                {/* Clear */}
                <button
                    type="button"
                    onClick={() =>
                        editor?.chain().focus().clearNodes().unsetAllMarks().run()
                    }
                    className="px-2 py-1 rounded text-sm text-white hover:bg-[#1E2826]"
                >
                    Clear
                </button>
            </div>

            <EditorContent
                editor={editor}
                className="min-h-[180px] px-3 py-2 [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[160px] [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_a]:text-[#2DE3A7] [&_.ProseMirror_a]:underline [&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child]:before:text-[#aaa] [&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none"
            />
        </div>
    );
}
