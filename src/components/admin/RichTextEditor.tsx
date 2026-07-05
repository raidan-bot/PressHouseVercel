import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
// @ts-ignore - custom indent commands handled in buttons
import { cn } from "../../lib/utils";

const FONT_FAMILIES = [
  { label: "Inter", value: "Inter" },
  { label: "Space Grotesk", value: "Space Grotesk" },
  { label: "Serif", value: "serif" },
  { label: "Monospace", value: "monospace" },
];

const TEXT_COLORS = [
  "#1e293b", "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
];

const BG_COLORS = [
  "#ffffff", "#f8fafc", "#fef2f2", "#ffedd5", "#fef9c3",
  "#dcfce7", "#cffafe", "#dbeafe", "#f3e8ff", "#fce7f3",
  ];
  
  interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
    dir?: "rtl" | "ltr";
    minHeight?: string;
  }
  
  const MenuButton = ({
    onClick,
    active,
    disabled,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "px-2 py-1.5 rounded-lg text-xs font-bold transition-all border",
      active
      ? "bg-slate-900 text-white border-slate-900"
      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100",
      disabled && "opacity-30 cursor-not-allowed"
    )}
  >
    {children}
  </button>
);

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
  dir = "ltr",
  minHeight = "200px",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true, allowBase64: true }),
      Placeholder.configure({ placeholder: placeholder || "Start writing..." }),
    ],
    content: value || "",
    editable: true,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html !== value) onChange(html);
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none outline-none px-4 py-3 min-h-[200px]",
          dir === "rtl" ? "text-right" : "text-left"
        ),
        style: `min-height: ${minHeight};`,
      },
    },
  });

  if (!editor) {
    return (
      <div className={cn("border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center", className)} style={{ minHeight }}>
        <div className="text-slate-400 text-sm">Loading editor...</div>
      </div>
    );
  }

  const addLink = () => {
    const url = window.prompt("URL:");
    if (url && url.trim()) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Image URL:");
    if (url && url.trim()) {
      editor.chain().focus().setImage({ src: url.trim() }).run();
    }
  };

  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white overflow-hidden", className)}>
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-100 bg-slate-50">
        {/* Headings */}
        <select
          onChange={(e) => {
            const level = parseInt(e.target.value);
            if (level === 0) editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: level as any }).run();
          }}
          value={
            editor.isActive("heading", { level: 1 }) ? "1" :
            editor.isActive("heading", { level: 2 }) ? "2" :
            editor.isActive("heading", { level: 3 }) ? "3" :
            editor.isActive("heading", { level: 4 }) ? "4" :
            "0"
          }
          className="px-2 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 outline-none cursor-pointer"
        >
          <option value="0">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </select>

        {/* Font Family */}
        <select
          onChange={(e) => {
            if (e.target.value) editor.chain().focus().setFontFamily(e.target.value).run();
          }}
          value={editor.getAttributes("textStyle").fontFamily || ""}
          className="px-2 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 outline-none cursor-pointer max-w-[100px]"
        >
          <option value="">Font</option>
          {FONT_FAMILIES.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        {/* Bold */}
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
          <strong>B</strong>
        </MenuButton>

        {/* Underline */}
        <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
          <span className="underline">U</span>
        </MenuButton>

        {/* Strike */}
        <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
          <span className="line-through">S</span>
        </MenuButton>

        {/* Text Color */}
        <div className="flex items-center gap-0.5">
          {TEXT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => editor.chain().focus().setColor(c).run()}
              className="w-5 h-5 rounded-full border border-slate-300 cursor-pointer transition-transform hover:scale-110"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* BG Color */}
        <div className="flex items-center gap-0.5">
          {BG_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                if (c === "#ffffff") editor.chain().focus().unsetHighlight().run();
                else editor.chain().focus().toggleHighlight({ color: c }).run();
              }}
              className="w-5 h-5 rounded-full border border-slate-300 cursor-pointer transition-transform hover:scale-110"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Subscript / Superscript */}
        <MenuButton onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive("subscript")} disabled={!editor.can().toggleSubscript()} title="Subscript">
          x<sub>2</sub>
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")} disabled={!editor.can().toggleSuperscript()} title="Superscript">
          x<sup>2</sup>
        </MenuButton>

        {/* Lists */}
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List">
          1.
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
          &#8226;
        </MenuButton>

        {/* Indentation */}
        <MenuButton onClick={() => { 
          const chain = editor.chain().focus(); 
          // @ts-ignore
          if (chain.indent) { chain.indent().run(); } 
          else { chain.sinkListItem("listItem").run(); } 
        }} title="Indent">
          &#8594;
        </MenuButton>
        <MenuButton onClick={() => { 
          const chain = editor.chain().focus(); 
          // @ts-ignore
          if (chain.outdent) { chain.outdent().run(); } 
          else { chain.liftListItem("listItem").run(); } 
        }} title="Outdent">
          &#8592;
        </MenuButton>

        {/* RTL/LTR */}
        <MenuButton onClick={() => editor.chain().focus().setTextAlign(dir === "rtl" ? "right" : "left").run()} active={editor.isActive({ textAlign: dir === "rtl" ? "right" : "left" })} title={dir === "rtl" ? "RTL" : "LTR"}>
          {dir === "rtl" ? "RTL" : "LTR"}
        </MenuButton>

        {/* Alignment */}
        <MenuButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left">
          &#8656;
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center">
          &#8660;
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align Right">
          &#8658;
        </MenuButton>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Link */}
        <MenuButton onClick={addLink} active={editor.isActive("link")} title="Insert Link">
          &#128279;
        </MenuButton>

        {/* Image */}
        <MenuButton onClick={addImage} title="Insert Image">
          &#128247;
        </MenuButton>

        {/* Blockquote */}
        <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
          &ldquo;
        </MenuButton>

        {/* Code Block */}
        <MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code Block">
          &lt;/&gt;
        </MenuButton>

        {/* Clear Formatting */}
        <MenuButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting">
          &#10007;
        </MenuButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}