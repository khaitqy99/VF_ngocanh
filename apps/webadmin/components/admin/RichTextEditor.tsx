"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Extension } from "@tiptap/core";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import Youtube from "@tiptap/extension-youtube";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import {
  BackgroundColor,
  Color,
  FontFamily,
  FontSize,
  TextStyle,
} from "@tiptap/extension-text-style";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ClipboardPaste,
  Code,
  Code2,
  Columns2,
  Eraser,
  Highlighter,
  ImageIcon,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Omega,
  Quote,
  Redo2,
  Replace,
  Rows3,
  Search,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table,
  TableProperties,
  Trash2,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
  Youtube as YoutubeIcon,
  X,
} from "lucide-react";
import { Button, Input } from "@/components/ui/core";

const TEXT_COLORS = [
  { label: "Đen", value: "#18181b" },
  { label: "Xám", value: "#52525b" },
  { label: "Đỏ VinFast", value: "#dc2626" },
  { label: "Cam", value: "#ea580c" },
  { label: "Xanh dương", value: "#2563eb" },
  { label: "Xanh lá", value: "#16a34a" },
  { label: "Tím", value: "#7c3aed" },
] as const;

const HIGHLIGHT_COLORS = [
  { label: "Vàng", value: "#fef08a" },
  { label: "Xanh lá nhạt", value: "#bbf7d0" },
  { label: "Xanh dương nhạt", value: "#bfdbfe" },
  { label: "Hồng", value: "#fecdd3" },
  { label: "Cam nhạt", value: "#fed7aa" },
  { label: "Tím nhạt", value: "#e9d5ff" },
] as const;

const FONT_SIZES = [
  { label: "Cỡ chữ", value: "" },
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "20", value: "20px" },
  { label: "24", value: "24px" },
  { label: "28", value: "28px" },
  { label: "32", value: "32px" },
  { label: "36", value: "36px" },
] as const;

const FONT_FAMILIES = [
  { label: "Phông chữ", value: "" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Times New Roman", value: "\"Times New Roman\", Times, serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Tahoma", value: "Tahoma, sans-serif" },
  { label: "Courier New", value: "\"Courier New\", Courier, monospace" },
] as const;

const SPECIAL_CHARS = [
  "₫", "€", "£", "¥", "©", "®", "™", "§", "¶", "†", "‡", "•", "…", "–", "—",
  "“", "”", "‘", "’", "«", "»", "±", "×", "÷", "≤", "≥", "≠", "≈", "∞", "√", "∑",
  "°", "µ", "α", "β", "γ", "δ", "π", "Ω", "←", "→", "↑", "↓", "✓", "✕", "★", "☆",
] as const;

const MAX_INDENT = 8;

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    paragraphIndent: {
      indentParagraph: () => ReturnType;
      outdentParagraph: () => ReturnType;
    };
  }
}

const ParagraphIndent = Extension.create({
  name: "paragraphIndent",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"],
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              const raw = element.getAttribute("data-indent");
              if (raw) return Math.min(MAX_INDENT, Math.max(0, Number(raw) || 0));
              const margin = element.style.marginLeft;
              const px = Number.parseInt(margin, 10);
              if (!Number.isFinite(px) || px <= 0) return 0;
              return Math.min(MAX_INDENT, Math.round(px / 24));
            },
            renderHTML: (attributes) => {
              const indent = Number(attributes.indent) || 0;
              if (!indent) return {};
              return {
                "data-indent": String(indent),
                style: `margin-left: ${indent * 24}px`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      indentParagraph:
        () =>
        ({ commands, state }) => {
          const typeName = state.selection.$from.parent.type.name;
          if (typeName !== "paragraph" && typeName !== "heading") return false;
          const indent = Number(state.selection.$from.parent.attrs.indent) || 0;
          if (indent >= MAX_INDENT) return false;
          return commands.updateAttributes(typeName, { indent: indent + 1 });
        },
      outdentParagraph:
        () =>
        ({ commands, state }) => {
          const typeName = state.selection.$from.parent.type.name;
          if (typeName !== "paragraph" && typeName !== "heading") return false;
          const indent = Number(state.selection.$from.parent.attrs.indent) || 0;
          if (indent <= 0) return false;
          return commands.updateAttributes(typeName, { indent: indent - 1 });
        },
    };
  },
});

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
      title={label}
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

function ToolbarDivider() {
  return <span className="mx-0.5 h-5 w-px bg-zinc-200" aria-hidden />;
}

function normalizeLinkUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "https://" || trimmed === "http://") return null;
  if (/^https?:\/\/.+/i.test(trimmed)) return trimmed;
  if (/^\/\S*/.test(trimmed)) return trimmed;
  if (/^[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(trimmed)) return `https://${trimmed}`;
  return trimmed.startsWith("http") ? null : `https://${trimmed}`;
}

function currentBlockValue(editor: Editor): string {
  if (editor.isActive("heading", { level: 2 })) return "h2";
  if (editor.isActive("heading", { level: 3 })) return "h3";
  if (editor.isActive("heading", { level: 4 })) return "h4";
  return "p";
}

function findAndReplaceInEditor(editor: Editor, search: string, replacement: string, all: boolean) {
  if (!search) return 0;
  const matches: { from: number; to: number }[] = [];
  editor.state.doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return;
    let index = 0;
    while (index < node.text.length) {
      const found = node.text.indexOf(search, index);
      if (found === -1) break;
      matches.push({ from: pos + found, to: pos + found + search.length });
      index = found + (all ? search.length : node.text.length);
      if (!all) break;
    }
  });
  if (!matches.length) return 0;
  let { tr } = editor.state;
  for (const match of [...matches].reverse()) {
    tr = tr.insertText(replacement, match.from, match.to);
  }
  editor.view.dispatch(tr);
  return matches.length;
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
  const [colorOpen, setColorOpen] = useState(false);
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [charsOpen, setCharsOpen] = useState(false);
  const [youtubeOpen, setYoutubeOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeError, setYoutubeError] = useState("");
  const [findOpen, setFindOpen] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [findMessage, setFindMessage] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: false,
        underline: false,
      }),
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      BackgroundColor,
      FontSize,
      FontFamily,
      ParagraphIndent,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      TableKit.configure({
        table: {
          resizable: true,
          HTMLAttributes: {
            class: "vf-article-table",
          },
        },
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: "vf-youtube-embed",
        },
      }),
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
          class: "my-4 block h-auto w-full max-w-full rounded-lg",
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
        lang: "vi",
        spellcheck: "false",
        class:
          "min-h-[320px] px-4 py-3 focus:outline-none prose prose-sm max-w-none [&_h2]:text-xl [&_h3]:text-lg [&_h4]:text-base [&_ul]:list-disc [&_ol]:list-decimal [&_a]:text-red-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_hr]:my-4 [&_hr]:border-zinc-200 [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-900 [&_pre]:p-3 [&_pre]:text-zinc-100 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-zinc-200 [&_td]:p-2 [&_th]:border [&_th]:border-zinc-200 [&_th]:bg-zinc-50 [&_th]:p-2 [&_img]:my-4 [&_img]:block [&_img]:h-auto [&_img]:w-full [&_img]:max-w-full [&_img]:cursor-pointer [&_img.ProseMirror-selectednode]:outline [&_img.ProseMirror-selectednode]:outline-2 [&_img.ProseMirror-selectednode]:outline-red-500 [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:rounded-lg",
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
          marks: [
            {
              type: "link",
              attrs: { href: url, target: "_blank", rel: "noopener noreferrer nofollow" },
            },
          ],
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

  const setBlockType = (next: string) => {
    const chain = editor.chain().focus();
    if (next === "h2") chain.toggleHeading({ level: 2 }).run();
    else if (next === "h3") chain.toggleHeading({ level: 3 }).run();
    else if (next === "h4") chain.toggleHeading({ level: 4 }).run();
    else chain.setParagraph().run();
  };

  const increaseIndent = () => {
    if (editor.isActive("listItem")) {
      editor.chain().focus().sinkListItem("listItem").run();
      return;
    }
    editor.chain().focus().indentParagraph().run();
  };

  const decreaseIndent = () => {
    if (editor.isActive("listItem")) {
      editor.chain().focus().liftListItem("listItem").run();
      return;
    }
    editor.chain().focus().outdentParagraph().run();
  };

  const pastePlainText = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) return;
      const html = text
        .split(/\n{2,}/)
        .map((block) => `<p>${block.replace(/\n/g, "<br>")}</p>`)
        .join("");
      editor.chain().focus().insertContent(html).run();
    } catch {
      window.alert("Không đọc được clipboard. Hãy cho phép quyền clipboard hoặc dán bằng Ctrl+Shift+V.");
    }
  };

  const insertYoutube = () => {
    const src = youtubeUrl.trim();
    if (!src) {
      setYoutubeError("Nhập link YouTube");
      return;
    }
    const ok = editor.commands.setYoutubeVideo({ src });
    if (!ok) {
      setYoutubeError("Link YouTube không hợp lệ");
      return;
    }
    setYoutubeOpen(false);
    setYoutubeUrl("");
    setYoutubeError("");
  };

  const runFindReplace = (all: boolean) => {
    const count = findAndReplaceInEditor(editor, findText, replaceText, all);
    setFindMessage(count ? `Đã thay ${count} chỗ` : "Không tìm thấy");
  };

  const textStyleAttrs = editor.getAttributes("textStyle") as {
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    fontFamily?: string;
  };
  const currentColor = textStyleAttrs.color || "#18181b";
  const currentHighlight = textStyleAttrs.backgroundColor || "#fef08a";
  const currentFontSize = textStyleAttrs.fontSize || "";
  const currentFontFamily = textStyleAttrs.fontFamily || "";
  const imageSelected = editor.isActive("image");
  const linkActive = editor.isActive("link");
  const inTable = editor.isActive("table");

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <div className="space-y-1 border-b border-zinc-200 bg-zinc-50 px-2 py-2">
          <div className="flex flex-wrap items-center gap-1">
            <select
              aria-label="Định dạng đoạn"
              className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs font-medium text-zinc-700"
              value={currentBlockValue(editor)}
              onChange={(e) => setBlockType(e.target.value)}
            >
              <option value="p">Đoạn</option>
              <option value="h2">Tiêu đề 2</option>
              <option value="h3">Tiêu đề 3</option>
              <option value="h4">Tiêu đề 4</option>
            </select>

            <select
              aria-label="Phông chữ"
              className="h-8 max-w-[140px] rounded-md border border-zinc-200 bg-white px-2 text-xs font-medium text-zinc-700"
              value={currentFontFamily}
              onChange={(e) => {
                const next = e.target.value;
                if (!next) editor.chain().focus().unsetFontFamily().run();
                else editor.chain().focus().setFontFamily(next).run();
              }}
            >
              {FONT_FAMILIES.map((font) => (
                <option key={`${font.label}-${font.value}`} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>

            <select
              aria-label="Cỡ chữ"
              className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs font-medium text-zinc-700"
              value={currentFontSize}
              onChange={(e) => {
                const next = e.target.value;
                if (!next) editor.chain().focus().unsetFontSize().run();
                else editor.chain().focus().setFontSize(next).run();
              }}
            >
              {FONT_SIZES.map((size) => (
                <option key={size.label} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>

            <ToolbarDivider />

            <ToolbarButton label="In đậm" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="In nghiêng" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Gạch chân" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
              <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Gạch ngang chữ" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Chữ trên" active={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
              <SuperscriptIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Chữ dưới" active={editor.isActive("subscript")} onClick={() => editor.chain().focus().toggleSubscript().run()}>
              <SubscriptIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Mã inline" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
              <Code className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton label="Danh sách" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Danh sách số" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Trích dẫn" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
              <Quote className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Khối code" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
              <Code2 className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton label="Căn trái" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Căn giữa" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Căn phải" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Căn đều" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
              <AlignJustify className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Giảm thụt lề" onClick={decreaseIndent}>
              <IndentDecrease className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Tăng thụt lề" onClick={increaseIndent}>
              <IndentIncrease className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <ToolbarButton label="Chèn / sửa liên kết" active={linkActive} onClick={openLinkDialog}>
              <Link2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Gỡ liên kết" active={linkActive} disabled={!linkActive} onClick={removeLink}>
              <Unlink className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Chèn ảnh tại con trỏ" onClick={insertImage}>
              <ImageIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Xóa ảnh đang chọn" active={imageSelected} disabled={!imageSelected} onClick={deleteImage}>
              <Trash2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Chèn YouTube"
              onClick={() => {
                setYoutubeError("");
                setYoutubeOpen(true);
              }}
            >
              <YoutubeIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Chèn bảng 3×3"
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            >
              <Table className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Chèn 2 cột"
              onClick={() => editor.chain().focus().insertTable({ rows: 1, cols: 2, withHeaderRow: false }).run()}
            >
              <Columns2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Thêm hàng"
              disabled={!inTable}
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              <Rows3 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Xóa bảng"
              disabled={!inTable}
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              <TableProperties className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton label="Đường kẻ ngang" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
              <Minus className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Ngắt trang"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertContent('<hr class="page-break" data-page-break="true" />')
                  .run()
              }
            >
              <Minus className="h-4 w-4 rotate-90" />
            </ToolbarButton>

            <div className="relative">
              <button
                type="button"
                aria-label="Màu chữ"
                title="Màu chữ"
                onClick={() => {
                  setHighlightOpen(false);
                  setCharsOpen(false);
                  setColorOpen((open) => !open);
                }}
                className={`inline-flex h-8 items-center gap-1 rounded-md border px-2 text-xs font-semibold text-zinc-700 transition ${
                  colorOpen || textStyleAttrs.color
                    ? "border-red-300 bg-red-50 text-red-700"
                    : "border-transparent hover:border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <span className="relative leading-none">
                  A
                  <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded" style={{ backgroundColor: currentColor }} />
                </span>
              </button>
              {colorOpen ? (
                <div className="absolute left-0 z-20 mt-1 w-44 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg">
                  <div className="grid grid-cols-7 gap-1">
                    {TEXT_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        title={color.label}
                        aria-label={color.label}
                        className="h-5 w-5 rounded-full border border-zinc-200"
                        style={{ backgroundColor: color.value }}
                        onClick={() => {
                          editor.chain().focus().setColor(color.value).run();
                          setColorOpen(false);
                        }}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="mt-2 w-full rounded-md px-2 py-1 text-left text-xs text-zinc-600 hover:bg-zinc-50"
                    onClick={() => {
                      editor.chain().focus().unsetColor().run();
                      setColorOpen(false);
                    }}
                  >
                    Xóa màu chữ
                  </button>
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label="Tô nền chữ"
                title="Tô nền chữ"
                onClick={() => {
                  setColorOpen(false);
                  setCharsOpen(false);
                  setHighlightOpen((open) => !open);
                }}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-zinc-600 transition ${
                  highlightOpen || textStyleAttrs.backgroundColor
                    ? "border-red-300 bg-red-50 text-red-700"
                    : "border-transparent hover:border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <Highlighter className="h-4 w-4" style={{ color: currentHighlight }} />
              </button>
              {highlightOpen ? (
                <div className="absolute left-0 z-20 mt-1 w-44 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg">
                  <div className="grid grid-cols-6 gap-1">
                    {HIGHLIGHT_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        title={color.label}
                        aria-label={color.label}
                        className="h-5 w-5 rounded border border-zinc-200"
                        style={{ backgroundColor: color.value }}
                        onClick={() => {
                          editor.chain().focus().setBackgroundColor(color.value).run();
                          setHighlightOpen(false);
                        }}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="mt-2 w-full rounded-md px-2 py-1 text-left text-xs text-zinc-600 hover:bg-zinc-50"
                    onClick={() => {
                      editor.chain().focus().unsetBackgroundColor().run();
                      setHighlightOpen(false);
                    }}
                  >
                    Xóa tô nền
                  </button>
                </div>
              ) : null}
            </div>

            <ToolbarButton
              label="Ký tự đặc biệt"
              onClick={() => {
                setColorOpen(false);
                setHighlightOpen(false);
                setCharsOpen((open) => !open);
              }}
            >
              <Omega className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Dán văn bản thuần" onClick={() => void pastePlainText()}>
              <ClipboardPaste className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Tìm / thay"
              onClick={() => {
                setFindMessage("");
                setFindOpen(true);
              }}
            >
              <Search className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Xóa định dạng" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
              <Eraser className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton label="Hoàn tác" onClick={() => editor.chain().focus().undo().run()}>
              <Undo2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Làm lại" onClick={() => editor.chain().focus().redo().run()}>
              <Redo2 className="h-4 w-4" />
            </ToolbarButton>

            {imageSelected ? (
              <span className="ml-1 text-xs text-red-600">Ảnh đang chọn — bấm Xóa hoặc Delete</span>
            ) : null}
          </div>

          {charsOpen ? (
            <div className="rounded-md border border-zinc-200 bg-white p-2">
              <div className="mb-1 text-[11px] font-medium text-zinc-500">Ký tự đặc biệt</div>
              <div className="flex flex-wrap gap-1">
                {SPECIAL_CHARS.map((char) => (
                  <button
                    key={char}
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded border border-zinc-200 text-sm hover:bg-zinc-50"
                    onClick={() => {
                      editor.chain().focus().insertContent(char).run();
                      setCharsOpen(false);
                    }}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <EditorContent editor={editor} />
      </div>

      {linkOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-black/50" aria-label="Đóng" onClick={() => setLinkOpen(false)} />
          <div className="relative w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-900">{editingExistingLink ? "Sửa liên kết" : "Chèn liên kết"}</h3>
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
                  <Input value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="Nội dung liên kết" />
                </div>
              ) : (
                <p className="text-xs text-zinc-500">
                  Liên kết sẽ áp dụng cho: <span className="font-medium text-zinc-700">{linkText || "…"}</span>
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

      {youtubeOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-black/50" aria-label="Đóng" onClick={() => setYoutubeOpen(false)} />
          <div className="relative w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-900">Chèn YouTube</h3>
              <button type="button" onClick={() => setYoutubeOpen(false)} className="rounded-md p-1 hover:bg-zinc-100">
                <X className="h-5 w-5 text-zinc-500" />
              </button>
            </div>
            <div className="space-y-4">
              <Input
                value={youtubeUrl}
                onChange={(e) => {
                  setYoutubeUrl(e.target.value);
                  setYoutubeError("");
                }}
                placeholder="https://www.youtube.com/watch?v=..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    insertYoutube();
                  }
                }}
              />
              {youtubeError ? <p className="text-sm text-red-600">{youtubeError}</p> : null}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setYoutubeOpen(false)}>
                  Hủy
                </Button>
                <Button type="button" onClick={insertYoutube}>
                  Chèn
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {findOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-black/50" aria-label="Đóng" onClick={() => setFindOpen(false)} />
          <div className="relative w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-900">Tìm và thay thế</h3>
              <button type="button" onClick={() => setFindOpen(false)} className="rounded-md p-1 hover:bg-zinc-100">
                <X className="h-5 w-5 text-zinc-500" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700">Tìm</label>
                <Input value={findText} onChange={(e) => setFindText(e.target.value)} autoFocus />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700">Thay bằng</label>
                <Input value={replaceText} onChange={(e) => setReplaceText(e.target.value)} />
              </div>
              {findMessage ? <p className="text-sm text-zinc-600">{findMessage}</p> : null}
              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => runFindReplace(false)}>
                  <Replace className="mr-1 h-4 w-4" />
                  Thay 1
                </Button>
                <Button type="button" onClick={() => runFindReplace(true)}>
                  Thay tất cả
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
});
