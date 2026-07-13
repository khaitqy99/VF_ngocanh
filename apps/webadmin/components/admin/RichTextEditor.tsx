"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Heading2,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Trash2,
  Underline as UnderlineIcon,
  Unlink,
  X,
} from "lucide-react";
import { Button, Input } from "@/components/ui/core";

function ToolbarButton({
  active,
  disabled,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-zinc-600 transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "border-red-300 bg-red-50 text-red-700"
          : "border-transparent hover:border-zinc-200 hover:bg-zinc-50"
      }`}
    >
      {children}
    </button>
  );
}

function normalizeLinkUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "https://" || trimmed === "http://") return null;
  if (/^https?:\/\/.+/i.test(trimmed)) return trimmed;
  if (/^\/\S*/.test(trimmed)) return trimmed;
  if (/^[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(trimmed)) return `https://${trimmed}`;
  return trimmed.startsWith("http") ? null : `https://${trimmed}`;
}

export type RichTextEditorHandle = {
  insertImageAtCursor: (src: string) => void;
};

export const RichTextEditor = forwardRef<
  RichTextEditorHandle,
  {
    value: string;
    onChange: (html: string) => void;
    onPickImage?: () => void;
  }
>(function RichTextEditor({ value, onChange, onPickImage }, ref) {
  const savedSelectionRef = useRef<{ from: number; to: number } | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkError, setLinkError] = useState("");
  const [selectionWasEmpty, setSelectionWasEmpty] = useState(false);
  const [editingExistingLink, setEditingExistingLink] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer nofollow",
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "mx-auto my-4 max-h-[480px] w-auto max-w-full rounded-lg",
        },
      }),
      Placeholder.configure({ placeholder: "Viết nội dung bài viết..." }),
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] px-4 py-3 focus:outline-none prose prose-sm max-w-none [&_h2]:text-xl [&_h3]:text-lg [&_ul]:list-disc [&_ol]:list-decimal [&_a]:text-red-600 [&_a]:underline [&_img]:cursor-pointer [&_img.ProseMirror-selectednode]:outline [&_img.ProseMirror-selectednode]:outline-2 [&_img.ProseMirror-selectednode]:outline-red-500 [&_img.ProseMirror-selectednode]:outline-offset-2",
      },
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      insertImageAtCursor(src: string) {
        if (!editor) return;

        const saved = savedSelectionRef.current;
        if (saved) {
          editor.chain().focus().setTextSelection(saved.from).setImage({ src }).run();
        } else {
          editor.chain().focus().setImage({ src }).run();
        }

        savedSelectionRef.current = null;
      },
    }),
    [editor],
  );

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "<p></p>";
    if (current !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return <div className="min-h-[360px] rounded-lg border border-zinc-200 bg-zinc-50" />;
  }

  const saveSelection = () => {
    const { from, to } = editor.state.selection;
    savedSelectionRef.current = { from, to };
  };

  const openLinkDialog = () => {
    const { from, to, empty } = editor.state.selection;
    saveSelection();
    setSelectionWasEmpty(empty);

    const existingHref = editor.getAttributes("link").href as string | undefined;
    const selectedText = empty ? "" : editor.state.doc.textBetween(from, to, " ");
    const safeHref =
      existingHref && existingHref !== "https://" && existingHref !== "http://"
        ? existingHref
        : "";

    setLinkUrl(safeHref);
    setLinkText(selectedText);
    setLinkError("");
    setEditingExistingLink(editor.isActive("link"));
    setLinkOpen(true);
  };

  const applyLink = () => {
    const saved = savedSelectionRef.current;
    if (!saved) return;

    const url = normalizeLinkUrl(linkUrl);
    if (!url) {
      setLinkError("Vui lòng nhập URL hợp lệ (vd: https://vinfast.vn hoặc /oto)");
      return;
    }

    const { from, to } = saved;
    const empty = from === to;
    const displayText = linkText.trim() || url;

    if (empty) {
      editor
        .chain()
        .focus()
        .setTextSelection(from)
        .insertContent({
          type: "text",
          text: displayText,
          marks: [{ type: "link", attrs: { href: url, target: "_blank", rel: "noopener noreferrer nofollow" } }],
        })
        .run();
    } else {
      editor.chain().focus().setTextSelection({ from, to }).setLink({ href: url }).run();
    }

    savedSelectionRef.current = null;
    setLinkOpen(false);
    setLinkError("");
  };

  const removeLink = () => {
    const saved = savedSelectionRef.current ?? editor.state.selection;
    editor
      .chain()
      .focus()
      .setTextSelection({ from: saved.from, to: saved.to })
      .extendMarkRange("link")
      .unsetLink()
      .run();
    savedSelectionRef.current = null;
    setLinkOpen(false);
    setLinkError("");
  };

  const insertImage = () => {
    if (onPickImage) {
      saveSelection();
      onPickImage();
      return;
    }
    const url = window.prompt("Nhập URL ảnh", "/images/showroom.webp");
    if (!url?.trim()) return;
    saveSelection();
    editor.chain().focus().setTextSelection(savedSelectionRef.current!.from).setImage({ src: url.trim() }).run();
    savedSelectionRef.current = null;
  };

  const deleteImage = () => {
    editor.chain().focus().deleteSelection().run();
  };

  const imageSelected = editor.isActive("image");
  const linkActive = editor.isActive("link");

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-zinc-50 px-2 py-2">
          <ToolbarButton
            label="In đậm"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="In nghiêng"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Gạch chân"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Tiêu đề"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Danh sách"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Danh sách số"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton label="Chèn / sửa liên kết" active={linkActive} onClick={openLinkDialog}>
            <Link2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Gỡ liên kết"
            active={linkActive}
            disabled={!linkActive}
            onClick={removeLink}
          >
            <Unlink className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton label="Chèn ảnh tại con trỏ" onClick={insertImage}>
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Xóa ảnh đang chọn"
            active={imageSelected}
            disabled={!imageSelected}
            onClick={deleteImage}
          >
            <Trash2 className="h-4 w-4" />
          </ToolbarButton>
          {imageSelected ? (
            <span className="ml-1 text-xs text-red-600">Ảnh đang chọn — bấm Xóa hoặc phím Delete</span>
          ) : null}
        </div>
        <EditorContent editor={editor} />
      </div>

      {linkOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Đóng"
            onClick={() => setLinkOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-900">
                {editingExistingLink ? "Sửa liên kết" : "Chèn liên kết"}
              </h3>
              <button type="button" onClick={() => setLinkOpen(false)} className="rounded-md p-1 hover:bg-zinc-100">
                <X className="h-5 w-5 text-zinc-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">URL</label>
                <Input
                  value={linkUrl}
                  onChange={(e) => {
                    setLinkUrl(e.target.value);
                    setLinkError("");
                  }}
                  placeholder="https://vinfast.vn hoặc /oto"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyLink();
                    }
                  }}
                />
              </div>

              {selectionWasEmpty ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Văn bản hiển thị</label>
                  <Input
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Nội dung liên kết (để trống sẽ dùng URL)"
                  />
                </div>
              ) : (
                <p className="text-xs text-zinc-500">
                  Liên kết sẽ áp dụng cho đoạn đã bôi đen:{" "}
                  <span className="font-medium text-zinc-700">{linkText || "…"}</span>
                </p>
              )}

              {linkError ? <p className="text-sm text-red-600">{linkError}</p> : null}

              <div className="flex flex-wrap justify-end gap-2">
                {editingExistingLink ? (
                  <Button type="button" variant="outline" onClick={removeLink}>
                    Gỡ liên kết
                  </Button>
                ) : null}
                <Button type="button" variant="outline" onClick={() => setLinkOpen(false)}>
                  Hủy
                </Button>
                <Button type="button" onClick={applyLink}>
                  Áp dụng
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
});
