import React, { useState, useRef, useCallback } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Image as ImageIcon, Link as LinkIcon, Heading1, Heading2, Quote, Undo, Redo, Code } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  minHeight = '300px',
  className,
  disabled = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  const execCommand = useCallback((command: string, valueOrArg: string | null = null) => {
    document.execCommand(command, false, valueOrArg);
    updateActiveFormats();
  }, []);

  const updateActiveFormats = () => {
    const formats = [];
    if (document.queryCommandState('bold')) formats.push('bold');
    if (document.queryCommandState('italic')) formats.push('italic');
    if (document.queryCommandState('underline')) formats.push('underline');
    setActiveFormats(formats);
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) execCommand('insertImage', url);
  };

  const insertLink = () => {
    const url = prompt('Enter link URL:');
    if (url) execCommand('createLink', url);
  };

  const toolbarButtons = [
    { icon: Undo, command: 'undo', title: 'Undo' },
    { icon: Redo, command: 'redo', title: 'Redo' },
    null,
    { icon: Heading1, command: 'formatBlock', value: 'H1', title: 'Heading 1' },
    { icon: Heading2, command: 'formatBlock', value: 'H2', title: 'Heading 2' },
    null,
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    null,
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
    null,
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numberedtolist' },
    null,
    { icon: Quote, command: 'formatBlock', value: 'BLOCKQUOTE', title: 'Quote' },
  ] as const;

  return (
    <div className={cn('border border-slate-200 rounded-2xl overflow-hidden bg-white', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
        {toolbarButtons.map((button, index) => {
          if (button === null) {
            return <div key={index} className="w-px h-6 bg-slate-200 mx-1" />;
          }
          const Icon = button.icon;
          const isActive = button.command && activeFormats.includes(button.command);
          return (
            <button
              key={index}
              type="button"
              onClick={() => execCommand(button.command, button.value)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-200 text-slate-600'
              )}
              title={button.title}
              disabled={disabled}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        className="p-4 focus:outline-none prose prose-slate max-w-none min-h-[300px]"
        style={{ minHeight }}
        onInput={handleInput}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />

      {/* Character count */}
      <div className="px-4 py-2 text-xs text-slate-400 font-medium text-right border-t border-slate-100">
        <span>{value.length} characters</span>
      </div>
    </div>
  );
}

export default RichTextEditor;