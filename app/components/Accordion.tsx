import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { cn } from '../lib/utils';

interface AccordionContextType {
  activeItems: string[];
  toggleItem: (id: string) => void;
  isItemActive: (id: string) => boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined,
);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion');
  }
  return context;
};

interface AccordionProps {
  children: ReactNode;
  defaultOpen?: string;
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  defaultOpen,
  allowMultiple = false,
  className = '',
}) => {
  const [activeItems, setActiveItems] = useState<string[]>(
    defaultOpen ? [defaultOpen] : [],
  );

  const toggleItem = (id: string) => {
    setActiveItems((prev) => {
      if (allowMultiple) {
        return prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id];
      }
      return prev.includes(id) ? [] : [id];
    });
  };

  const isItemActive = (id: string) => activeItems.includes(id);

  return (
    <AccordionContext.Provider
      value={{ activeItems, toggleItem, isItemActive }}
    >
      <div className={cn('space-y-2', className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  children,
  className = '',
}) => {
  return (
    <div
      className={cn('overflow-hidden border-b border-gray-200', className)}
      role="region"
      aria-labelledby={`accordion-header-${id}`}
    >
      {children}
    </div>
  );
};

interface AccordionHeaderProps {
  itemId: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  itemId,
  children,
  className = '',
  icon,
  iconPosition = 'right',
}) => {
  const { toggleItem, isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  const defaultIcon = (
    <svg
      className={cn('w-5 h-5 transition-transform duration-200', {
        'rotate-180': isActive,
      })}
      fill="none"
      stroke="#98A2B3"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  const handleClick = () => {
    toggleItem(itemId);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      toggleItem(itemId);
    }
  };

  return (
    <button
      id={`accordion-header-${itemId}`}
      aria-controls={`accordion-content-${itemId}`}
      aria-expanded={isActive}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'w-full px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors duration-200 flex items-center justify-between cursor-pointer',
        className,
      )}
    >
      <div className="flex items-center space-x-3">
        {iconPosition === 'left' && (icon || defaultIcon)}
        <span className="flex-1">{children}</span>
      </div>
      {iconPosition === 'right' && (icon || defaultIcon)}
    </button>
  );
};

interface AccordionContentProps {
  itemId: string;
  children: ReactNode;
  className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  itemId,
  children,
  className = '',
}) => {
  const { isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  return (
    <div
      id={`accordion-content-${itemId}`}
      role="region"
      aria-labelledby={`accordion-header-${itemId}`}
      className={cn(
        'overflow-hidden transition-all duration-300 ease-in-out',
        isActive ? 'max-h-fit opacity-100' : 'max-h-0 opacity-0',
        className,
      )}
    >
      <div className="px-4 py-3">{children}</div>
    </div>
  );
};
