import './ContextMenu.css';
import { ContextMenuItem } from '../../../lib/types';

interface ContextMenuProps {
  items: ContextMenuItem[];
  position: { x: number; y: number };
}

export default function ContextMenu({ items, position }: ContextMenuProps) {
  return (
    <div className="context-menu" style={{ left: position.x, top: position.y }}>
      {items.map((item) => (
        <div
          key={Math.random()}
          className="context-menu__item"
          onClick={item.onClick}
        >
          {item.icon && <span className="context-menu__icon">{item.icon}</span>}
          <span className="context-menu__label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
