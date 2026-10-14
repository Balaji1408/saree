import type { ElementType } from "react";

type Props = {
  lines: string[];
  as?: ElementType;
  className?: string;
};

export function MaskedLines({ lines, as: Tag = "h2", className }: Props) {
  return (
    <Tag className={className} data-lines>
      {lines.map((line) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <span data-line className="block">
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
