interface Props {
  isVisible: boolean;
}

export function TypingIndicator({ isVisible }: Props) {
  if (!isVisible) return null;

  return (
    <div className="flex gap-3 px-4 py-4 justify-start">
      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-accent text-xs font-bold">G</span>
      </div>
      <div className="flex gap-1 items-center py-2">
        <span className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
