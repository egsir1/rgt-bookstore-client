'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { List, ListOrdered, Undo2, Redo2 } from 'lucide-react';
import { HeadingValue, MenuProps } from '@/types/text-editor';

const HeadingSelect = ({ editor }: MenuProps) => {
	const [value, setValue] = React.useState<HeadingValue>('paragraph');

	React.useEffect(() => {
		if (!editor) return;
		const update = () => {
			if (editor.isActive('heading', { level: 1 })) setValue('h1');
			else if (editor.isActive('heading', { level: 2 })) setValue('h2');
			else if (editor.isActive('heading', { level: 3 })) setValue('h3');
			else setValue('paragraph');
		};
		update();
		editor.on('update', update);
		return () => {
			editor.off('update', update);
		};
	}, [editor]);

	const apply = (v: HeadingValue) => {
		if (!editor) return;
		switch (v) {
			case 'h1':
				editor.chain().focus().toggleHeading({ level: 1 }).run();
				break;
			case 'h2':
				editor.chain().focus().toggleHeading({ level: 2 }).run();
				break;
			case 'h3':
				editor.chain().focus().toggleHeading({ level: 3 }).run();
				break;
			default:
				editor.chain().focus().setParagraph().run();
		}
		setValue(v);
	};

	return (
		<select
			value={value}
			onChange={e => apply(e.target.value as HeadingValue)}
			className='heading-select border rounded-sm p-1 bg-background cursor-pointer'
		>
			<option value='paragraph'>Paragraph</option>
			<option value='h1'>Heading 1</option>
			<option value='h2'>Heading 2</option>
			<option value='h3'>Heading 3</option>
		</select>
	);
};

export const MenuBar = ({ editor }: MenuProps) => {
	if (!editor) return null;

	const btn = (active: boolean) =>
		`px-3 py-1 rounded-sm border ${active ? 'bg-accent' : ''}`;

	return (
		<div className='flex flex-wrap gap-1 bg-background border-b px-2 py-1 text-muted-foreground'>
			<HeadingSelect editor={editor} />

			{/*  basic inline  */}
			<Button
				type='button'
				variant='outline'
				className={btn(editor.isActive('bold'))}
				onClick={() => editor.chain().focus().toggleBold().run()}
			>
				<strong>B</strong>
			</Button>

			<Button
				type='button'
				variant='outline'
				className={btn(editor.isActive('underline'))}
				onClick={() => editor.chain().focus().toggleUnderline().run()}
			>
				U
			</Button>
			<Button
				type='button'
				variant='outline'
				className={btn(editor.isActive('strike'))}
				onClick={() => editor.chain().focus().toggleStrike().run()}
			>
				S
			</Button>

			{/*  lists  */}
			<Button
				type='button'
				variant='outline'
				className={btn(editor.isActive('bulletList'))}
				onClick={() => editor.chain().focus().toggleBulletList().run()}
			>
				<List size={16} />
			</Button>
			<Button
				type='button'
				variant='outline'
				className={btn(editor.isActive('orderedList'))}
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
			>
				<ListOrdered size={16} />
			</Button>

			{/* undo / redo */}
			<Button
				type='button'
				variant='outline'
				onClick={() => editor.chain().focus().undo().run()}
			>
				<Undo2 size={16} /> {/* ← Lucide icon */}
			</Button>

			<Button
				type='button'
				variant='outline'
				onClick={() => editor.chain().focus().redo().run()}
			>
				<Redo2 size={16} /> {/* ← Lucide icon */}
			</Button>
		</div>
	);
};
