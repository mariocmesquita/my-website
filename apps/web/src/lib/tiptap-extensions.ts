import type { Extensions } from '@tiptap/core';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Color } from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import { common, createLowlight } from 'lowlight';

export const lowlight = createLowlight(common);

/**
 * Extensions shared between the WYSIWYG editor and the public post renderer.
 * Both consumers must include these to ensure the JSON round-trip is lossless.
 */
export const BASE_EXTENSIONS: Extensions = [
  StarterKit.configure({ link: false, codeBlock: false, heading: { levels: [1, 2, 3, 4, 5, 6] } }),
  CodeBlockLowlight.configure({ lowlight }),
  TextStyle,
  Color,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Image,
  Table.configure({ resizable: false }),
  TableRow,
  TableCell,
  TableHeader,
];
