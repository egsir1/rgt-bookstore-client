import { useEditor } from '@tiptap/react';

export type MenuProps = { editor: ReturnType<typeof useEditor> | null };
export type HeadingValue = 'paragraph' | 'h1' | 'h2' | 'h3';
export interface RichTextEditorProps {
	initialHTML?: string;
	onChange?: (html: string) => void;
	courseDescription?: string;
}
