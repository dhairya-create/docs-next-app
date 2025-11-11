"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DocumentInput } from "./document-input";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  MenubarMenu,
} from "@/components/ui/menubar";
import {
  BoldIcon,
  FileIcon,
  FileJson,
  FilePenIcon,
  FilePlusIcon,
  FileTextIcon,
  GlobeIcon,
  ItalicIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  TextIcon,
  TrashIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { BsFilePdf } from "react-icons/bs";
import { useEditorStore } from "@/store/use-editor-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { editor } = useEditorStore();

  // local state for hover + dialog
  const [hovered, setHovered] = useState({ rows: 0, cols: 0 });
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(1);
  const [cols, setCols] = useState(1);
  const maxRows = 5;
  const maxCols = 5;

  const insertTable = ({ rows, cols }: { rows: number; cols: number }) => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: false })
      .run();
  };

  const handleCustomInsert = () => {
    if (rows > 0 && cols > 0) {
      insertTable({ rows, cols });
      setOpen(false);
      setRows(1);
      setCols(1);
    }
  };

  const onDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const onSaveJSON = () => {
    if (!editor) return;
    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], {
      type: "application/json",
    });
    onDownload(blob, `document.json`);
  };

  const onSaveHTML = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], {
      type: "text/html",
    });
    onDownload(blob, `document.html`);
  };

  const onSaveText = () => {
    if (!editor) return;
    const content = editor.getText();
    const blob = new Blob([content], {
      type: "text/plain",
    });
    onDownload(blob, `document.txt`);
  };

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors duration-200">
            <Image
              src="/logo.svg"
              alt="Docs Logo"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
        </Link>

        <div className="flex flex-col">
          <DocumentInput />
          <div className="flex">
            <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
              {/* FILE MENU */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  File
                </MenubarTrigger>
                <MenubarContent className="print:hidden">
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <FileIcon className="size-4 mr-2" />
                      Save
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={onSaveJSON}>
                        <FileJson className="size-4 mr-2" />
                        JSON
                      </MenubarItem>
                      <MenubarItem onClick={onSaveHTML}>
                        <GlobeIcon className="size-4 mr-2" />
                        HTML
                      </MenubarItem>
                      <MenubarItem onClick={() => window.print()}>
                        <BsFilePdf className="size-4 mr-2" />
                        PDF
                      </MenubarItem>
                      <MenubarItem onClick={onSaveText}>
                        <FileTextIcon className="size-4 mr-2" />
                        Text
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem>
                    <FilePlusIcon className="size-4 mr-2" />
                    New Document
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <FilePenIcon className="size-4 mr-2" />
                    Rename
                  </MenubarItem>
                  <MenubarItem>
                    <TrashIcon className="size-4 mr-2" />
                    Remove
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => window.print()}>
                    <PrinterIcon className="size-4 mr-2" />
                    Print
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* EDIT MENU */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Edit
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem
                    onClick={() => editor?.chain().focus().undo().run()}
                  >
                    <Undo2Icon className="size-4 mr-2" />
                    Undo
                  </MenubarItem>
                  <MenubarItem
                    onClick={() => editor?.chain().focus().redo().run()}
                  >
                    <Redo2Icon className="size-4 mr-2" />
                    Redo
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* INSERT MENU */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Insert
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>Table</MenubarSubTrigger>
                    <MenubarSubContent className="p-2">
                      {/* Table Grid */}
                      <div className="grid grid-cols-5 gap-[2px] mb-2">
                        {Array.from({ length: maxRows * maxCols }).map(
                          (_, i) => {
                            const row = Math.floor(i / maxCols) + 1;
                            const col = (i % maxCols) + 1;
                            const isActive =
                              row <= hovered.rows && col <= hovered.cols;
                            return (
                              <div
                                key={i}
                                onMouseEnter={() =>
                                  setHovered({ rows: row, cols: col })
                                }
                                onClick={() =>
                                  insertTable({ rows: row, cols: col })
                                }
                                className={`w-5 h-5 border border-gray-300 dark:border-neutral-700 rounded-sm cursor-pointer transition-colors ${
                                  isActive
                                    ? "bg-blue-500"
                                    : "bg-transparent hover:bg-gray-200 dark:hover:bg-neutral-700"
                                }`}
                              />
                            );
                          }
                        )}
                      </div>
                      <div className="text-xs text-center mb-2 text-gray-500 dark:text-gray-400">
                        {hovered.rows && hovered.cols
                          ? `${hovered.rows} × ${hovered.cols}`
                          : "Select size"}
                      </div>

                      <MenubarSeparator />

                      {/* Custom size dialog */}
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-sm"
                          >
                            Custom size…
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[380px]">
                          <DialogHeader>
                            <DialogTitle>Insert Custom Table</DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col gap-4 mt-3">
                            <div className="flex items-center gap-3">
                              <Label htmlFor="rows" className="w-20">
                                Rows
                              </Label>
                              <Input
                                id="rows"
                                type="number"
                                min={1}
                                value={rows}
                                onChange={(e) =>
                                  setRows(Number(e.target.value))
                                }
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <Label htmlFor="cols" className="w-20">
                                Columns
                              </Label>
                              <Input
                                id="cols"
                                type="number"
                                min={1}
                                value={cols}
                                onChange={(e) =>
                                  setCols(Number(e.target.value))
                                }
                              />
                            </div>
                          </div>
                          <DialogFooter className="mt-4">
                            <Button
                              variant="outline"
                              onClick={() => setOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleCustomInsert}>Insert</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>

              {/* FORMAT MENU */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Format
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <TextIcon className="size-4 mr-2" />
                      Text
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem
                        onClick={() =>
                          editor?.chain().focus().toggleBold().run()
                        }
                      >
                        <BoldIcon className="size-4 mr-2" />
                        Bold
                      </MenubarItem>
                      <MenubarItem
                        onClick={() =>
                          editor?.chain().focus().toggleItalic().run()
                        }
                      >
                        <ItalicIcon className="size-4 mr-2" />
                        Italic
                      </MenubarItem>
                      <MenubarItem
                        onClick={() =>
                          editor?.chain().focus().toggleUnderline().run()
                        }
                      >
                        <UnderlineIcon className="size-4 mr-2" />
                        Underline
                      </MenubarItem>
                      <MenubarItem
                        onClick={() =>
                          editor?.chain().focus().toggleStrike().run()
                        }
                      >
                        <StrikethroughIcon className="size-4 mr-2" />
                        Strikethrough
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem
                    onClick={() =>
                      editor?.chain().focus().unsetAllMarks().run()
                    }
                  >
                    <RemoveFormattingIcon className="size-3 mr-2" />
                    Clear Formatting
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
       <div className="flex gap-3 items-center pl-6">
        <OrganizationSwitcher 
        afterCreateOrganizationUrl="/"
        afterLeaveOrganizationUrl="/"
        afterSelectOrganizationUrl="/"
        afterSelectPersonalUrl="/"
        />
      <UserButton afterSignOutUrl="/" />

      </div>
    </nav>
  );
};

export default Navbar;
