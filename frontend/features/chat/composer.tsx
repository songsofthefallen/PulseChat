"use client";

import * as React from "react";
import { Paperclip, Plus, SendHorizontal, Smile, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const QUICK_EMOJI = ["😀", "😂", "😍", "👍", "🎉", "🙏", "🔥", "😢", "😮", "❤️", "👀", "✅"];

interface PendingFile {
  id: string;
  file: File;
  previewUrl?: string;
  progress: number;
}

export function Composer({
  channelName,
  onSend,
}: {
  channelName: string;
  onSend?: (content: string) => void;
}) {
  const [value, setValue] = React.useState("");
  const [files, setFiles] = React.useState<PendingFile[]>([]);
  const [dragging, setDragging] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const typingTimeout = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  function addFiles(fileList: FileList | File[]) {
    const newFiles: PendingFile[] = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    // Simulate upload progress — replace with messagesApi.uploadAttachment.
    newFiles.forEach((nf) => simulateUpload(nf.id, setFiles));
  }

  function handleTyping() {
    // TODO: emit a "typing" event over the websocket connection.
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      // TODO: emit "stopped typing"
    }, 2000);
  }

  function handleSend() {
    if (!value.trim() && files.length === 0) return;
    onSend?.(value.trim());
    setValue("");
    setFiles([]);
    textareaRef.current?.focus();
  }

  return (
    <div
      className={cn(
        "relative m-4 mt-0 rounded-lg border border-border bg-surface-sunken transition-colors",
        dragging && "border-accent bg-accent-soft/40"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
      }}
      onPaste={(e) => {
        const items = Array.from(e.clipboardData.items).filter((i) =>
          i.type.startsWith("image/")
        );
        if (items.length) {
          const pasted = items
            .map((i) => i.getAsFile())
            .filter((f): f is File => !!f);
          if (pasted.length) addFiles(pasted);
        }
      }}
    >
      {dragging && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg border-2 border-dashed border-accent text-sm font-medium text-accent">
          Drop to upload
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b border-border p-3">
          {files.map((f) => (
            <div
              key={f.id}
              className="relative flex w-40 flex-col gap-1 rounded-md border border-border bg-surface p-2"
            >
              <button
                onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
                className="absolute -right-1.5 -top-1.5 rounded-full bg-foreground p-0.5 text-background"
                aria-label="Remove attachment"
              >
                <X className="size-3" />
              </button>
              {f.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.previewUrl}
                  alt={f.file.name}
                  className="h-16 w-full rounded object-cover"
                />
              ) : (
                <div className="flex h-16 w-full items-center justify-center rounded bg-surface-sunken">
                  <Paperclip className="size-5 text-muted-foreground" />
                </div>
              )}
              <p className="truncate text-[11px] text-muted-foreground">{f.file.name}</p>
              {f.progress < 100 && <Progress value={f.progress} className="h-1" />}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 p-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          aria-label="Upload a file"
          onClick={() => fileInputRef.current?.click()}
        >
          <Plus className="size-4" />
        </Button>

        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={`Message #${channelName}`}
          rows={1}
          className="max-h-40 min-h-9 flex-1 resize-none border-0 bg-transparent px-1 py-1.5 shadow-none focus-visible:ring-0"
        />

        <EmojiPicker onSelect={(emoji) => setValue((v) => v + emoji)} />

        <Button
          size="icon"
          className="shrink-0"
          aria-label="Send message"
          onClick={handleSend}
          disabled={!value.trim() && files.length === 0}
        >
          <SendHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0" aria-label="Add emoji">
          <Smile className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <p className="mb-2 text-xs font-semibold text-muted-foreground">Frequently used</p>
        <div className="grid grid-cols-6 gap-1">
          {QUICK_EMOJI.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSelect(emoji)}
              className="rounded-md p-1.5 text-lg hover:bg-surface-sunken"
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function simulateUpload(
  id: string,
  setFiles: React.Dispatch<React.SetStateAction<PendingFile[]>>
) {
  const interval = setInterval(() => {
    setFiles((prev) => {
      const next = prev.map((f) =>
        f.id === id ? { ...f, progress: Math.min(100, f.progress + 20) } : f
      );
      const done = next.find((f) => f.id === id)?.progress === 100;
      if (done) clearInterval(interval);
      return next;
    });
  }, 200);
}
