import type { Action } from 'svelte/action';

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

type ResizeOptions = {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  onResize?: (dimensions: { width: number; height: number }) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
};

export const resize_window: Action<HTMLElement, ResizeOptions> = (node, options = {}) => {
  const {
    minWidth = 200,
    minHeight = 150,
    maxWidth = Infinity,
    maxHeight = Infinity,
    onResize,
    onResizeStart,
    onResizeEnd
  } = options;

  // Create resize handles
  const directions: ResizeDirection[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
  const handles: Record<ResizeDirection, HTMLDivElement> = {} as Record<ResizeDirection, HTMLDivElement>;

  // Create and append resize handles
  directions.forEach(dir => {
    const handle = document.createElement('div');
    handle.className = `resize-handle resize-${dir}`;
    handle.style.position = 'absolute';
    
    // Set position and dimensions based on direction
    switch (dir) {
      case 'n':
        handle.style.top = '-3px';
        handle.style.left = '8px';
        handle.style.right = '8px';
        handle.style.height = '6px';
        handle.style.cursor = 'ns-resize';
        break;
      case 's':
        handle.style.bottom = '-3px';
        handle.style.left = '8px';
        handle.style.right = '8px';
        handle.style.height = '6px';
        handle.style.cursor = 'ns-resize';
        break;
      case 'e':
        handle.style.right = '-3px';
        handle.style.top = '8px';
        handle.style.bottom = '8px';
        handle.style.width = '6px';
        handle.style.cursor = 'ew-resize';
        break;
      case 'w':
        handle.style.left = '-3px';
        handle.style.top = '8px';
        handle.style.bottom = '8px';
        handle.style.width = '6px';
        handle.style.cursor = 'ew-resize';
        break;
      case 'ne':
        handle.style.top = '-3px';
        handle.style.right = '-3px';
        handle.style.width = '12px';
        handle.style.height = '12px';
        handle.style.cursor = 'ne-resize';
        break;
      case 'nw':
        handle.style.top = '-3px';
        handle.style.left = '-3px';
        handle.style.width = '12px';
        handle.style.height = '12px';
        handle.style.cursor = 'nw-resize';
        break;
      case 'se':
        handle.style.bottom = '-3px';
        handle.style.right = '-3px';
        handle.style.width = '12px';
        handle.style.height = '12px';
        handle.style.cursor = 'se-resize';
        break;
      case 'sw':
        handle.style.bottom = '-3px';
        handle.style.left = '-3px';
        handle.style.width = '12px';
        handle.style.height = '12px';
        handle.style.cursor = 'sw-resize';
        break;
    }
    
    node.appendChild(handle);
    handles[dir] = handle;
  });

  // Resize functionality
  const resizeHandlers: Record<ResizeDirection, (e: MouseEvent) => void> = {} as Record<ResizeDirection, (e: MouseEvent) => void>;
  let initialWidth: number;
  let initialHeight: number;
  let initialX: number;
  let initialY: number;
  let initialRect: DOMRect;
  let currentDirection: ResizeDirection | null = null;
  
  // Variables to track original position and dimensions
  let initialLeft: number;
  let initialTop: number;
  let initialRight: number;
  let initialBottom: number;
  
  // Function to convert transform to absolute position
  const setupAbsolutePositioning = () => {
    const rect = node.getBoundingClientRect();
    const { x: translateX, y: translateY } = getTransformValues();
    
    // Set absolute positioning
    node.style.position = 'absolute';
    node.style.left = `${rect.left}px`;
    node.style.top = `${rect.top}px`;
    node.style.transform = 'none'; // Remove transform
    
    return { left: rect.left, top: rect.top };
  };
  
  // Function to restore transform-based positioning
  const restoreTransformPositioning = (left: number, top: number) => {
    // Convert absolute position back to transform
    node.style.position = 'absolute';
    node.style.left = '0';
    node.style.top = '0';
    node.style.transform = `translate(${left}px, ${top}px)`;
  };

  const getTransformValues = () => {
    const transform = window.getComputedStyle(node).transform;
    if (transform === 'none') return { x: 0, y: 0 };
    
    const matrix = transform.match(/matrix\((.*)\)/);
    if (!matrix) return { x: 0, y: 0 };
    
    const values = matrix[1].split(', ');
    return {
      x: parseFloat(values[4]),
      y: parseFloat(values[5])
    };
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!currentDirection) return;
    
    e.preventDefault();
    
    const dx = e.clientX - initialX;
    const dy = e.clientY - initialY;
    
    // Calculate new dimensions based on direction and constraints
    let newWidth = initialWidth;
    let newHeight = initialHeight;
    let newLeft = initialLeft;
    let newTop = initialTop;
    
    // Handle horizontal resizing
    if (currentDirection.includes('e')) {
      // East - right edge moves
      newWidth = Math.min(Math.max(initialWidth + dx, minWidth), maxWidth);
    }
    
    if (currentDirection.includes('w')) {
      // West - left edge moves
      const widthChange = initialX - e.clientX;
      const constrainedWidth = Math.min(Math.max(initialWidth + widthChange, minWidth), maxWidth);
      const actualWidthChange = constrainedWidth - initialWidth;
      
      // Only adjust left position if width actually changed
      if (constrainedWidth !== initialWidth) {
        newLeft = initialRight - constrainedWidth;
        newWidth = constrainedWidth;
      }
    }
    
    // Handle vertical resizing
    if (currentDirection.includes('s')) {
      // South - bottom edge moves
      newHeight = Math.min(Math.max(initialHeight + dy, minHeight), maxHeight);
    }
    
    if (currentDirection.includes('n')) {
      // North - top edge moves
      const heightChange = initialY - e.clientY;
      const constrainedHeight = Math.min(Math.max(initialHeight + heightChange, minHeight), maxHeight);
      const actualHeightChange = constrainedHeight - initialHeight;
      
      // Only adjust top position if height actually changed
      if (constrainedHeight !== initialHeight) {
        newTop = initialBottom - constrainedHeight;
        newHeight = constrainedHeight;
      }
    }
    
    // Apply new dimensions and position
    node.style.width = `${newWidth}px`;
    node.style.height = `${newHeight}px`;
    node.style.left = `${newLeft}px`;
    node.style.top = `${newTop}px`;
    
    // Call onResize callback if provided
    if (onResize) {
      onResize({ width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    if (currentDirection) {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Get current position before converting back
      const left = parseFloat(node.style.left);
      const top = parseFloat(node.style.top);
      
      // Convert back to transform-based positioning
      restoreTransformPositioning(left, top);
      
      currentDirection = null;
      
      if (onResizeEnd) {
        onResizeEnd();
      }
    }
  };

  // Set up resize handlers for each direction
  directions.forEach(dir => {
    const handler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Convert from transform to absolute positioning
      const { left, top } = setupAbsolutePositioning();
      
      // Get initial dimensions and position
      initialRect = node.getBoundingClientRect();
      initialWidth = initialRect.width;
      initialHeight = initialRect.height;
      initialX = e.clientX;
      initialY = e.clientY;
      
      // Store all initial positions
      initialLeft = initialRect.left;
      initialTop = initialRect.top;
      initialRight = initialRect.right;
      initialBottom = initialRect.bottom;
      
      currentDirection = dir;
      
      if (onResizeStart) {
        onResizeStart();
      }
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    
    handles[dir].addEventListener('mousedown', handler);
    resizeHandlers[dir] = handler;
  });

  return {
    update(newOptions: ResizeOptions) {
      // Update options if needed
      Object.assign(options, newOptions);
    },
    destroy() {
      // Clean up event listeners and remove handles
      directions.forEach(dir => {
        if (handles[dir]) {
          handles[dir].removeEventListener('mousedown', resizeHandlers[dir]);
          node.removeChild(handles[dir]);
        }
      });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  };
};