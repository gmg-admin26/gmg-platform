import { useReveal } from '../hooks/useReveal';

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number; // ms
  threshold?: number;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Wraps any section/div. Applies .reveal-section CSS class and adds
 * .is-revealed when the element enters the viewport.
 */
export function RevealSection({
  children,
  className = '',
  style,
  delay = 0,
  threshold = 0.10,
  as: Tag = 'div',
}: RevealSectionProps) {
  const [ref, revealed] = useReveal<HTMLElement>({ threshold, rootMargin: '0px 0px -60px 0px' });

  return (
    // @ts-expect-error — dynamic tag is valid, ts struggles with ref union
    <Tag
      ref={ref}
      className={`reveal-section${revealed ? ' is-revealed' : ''} ${className}`}
      style={{
        ...style,
        transitionDelay: revealed ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </Tag>
  );
}

interface RevealChildProps {
  children: React.ReactNode;
  delay?: number; // ms stagger offset
  className?: string;
  style?: React.CSSProperties;
  revealed: boolean; // passed from parent's useReveal
}

/**
 * Individual child that stagger-reveals when parent calls it revealed.
 */
export function RevealChild({
  children,
  delay = 0,
  className = '',
  style,
  revealed,
}: RevealChildProps) {
  return (
    <div
      className={`reveal-child${revealed ? ' is-revealed' : ''} ${className}`}
      style={{
        ...style,
        transitionDelay: revealed ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
  );
}
