import './ContextMenu.css';
import '../../../App.css';
import { ContextMenuItem } from '../../../lib/types';

interface ContextMenuProps {
  items: ContextMenuItem[];
  position: { x: number; y: number };
}

export default function ContextMenu({ items, position }: ContextMenuProps) {
  return (
    <div
      className="context-menu"
      style={{
        left: position.x,
        top: position.y,
        position: 'fixed',
        zIndex: 1000,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item) => (
        <button
          key={item.label}
          className="context-menu__item"
          onClick={() => {
            item.onClick();
          }}
        >
          {item.icon && <span className="context-menu__icon">{item.icon}</span>}
          <span className="context-menu__label">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
