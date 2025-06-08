'use client';

import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TextAlign from '@tiptap/extension-text-align';
import './text-editor.css';
import { MenuBar } from './menu.bar';
import { RichTextEditorProps } from '@/types/text-editor';

export default function RichTextEditor({
	initialHTML,
	onChange,
	courseDescription,
}: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			Strike,
			Link.configure({ openOnClick: false }),
			Highlight,
			Image.configure({ inline: false }),
			Table.configure({ resizable: true }),
			TableRow,
			TableHeader,
			TableCell,
			TextAlign.configure({ types: ['heading', 'paragraph'] }),
		],
		content: initialHTML ?? courseDescription ?? '',
		autofocus: 'end',
		onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
	});

	React.useEffect(() => {
		if (!editor) return;
		const html = initialHTML ?? courseDescription ?? '';
		if (html && html !== editor.getHTML()) {
			editor.commands.setContent(html, false);
		}
	}, [editor, initialHTML, courseDescription]);

	return (
		<div className='rounded border bg-transparent text-foreground'>
			<MenuBar editor={editor} />
			<EditorContent
				editor={editor}
				//	className='tiptap prose max-w-none px-4 py-3 dark:prose-invert'
			/>
		</div>
	);
}
