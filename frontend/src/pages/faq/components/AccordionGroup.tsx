import { useState } from 'react';

interface AccordionGroupProps {
  title: string;
  items: { question: string; answer: string }[];
}

export default function AccordionGroup({ title, items }: AccordionGroupProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      <h3 className="font-heading text-xl font-semibold text-foreground-950">{title}</h3>
      <div className="mt-4 border-t border-background-300">
        {items.map((item, index) => {
          const isOpen = open === index;
          return (
            <div key={item.question} className="border-b border-background-300">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-heading text-base font-semibold leading-snug text-foreground-950 md:text-lg">
                  {item.question}
                </span>
                <i
                  className={`ri-add-line shrink-0 text-lg text-primary-700 transition-transform duration-300 ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-500 ease-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-2xl pb-5 text-[15px] leading-relaxed text-foreground-600">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

