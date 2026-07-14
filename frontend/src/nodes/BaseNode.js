import { Handle, Position } from 'reactflow';
import { logger } from '../utils/logger';
import { useEffect } from 'react';
import { useStore } from '../store';

export const BaseNode = ({ 
  id, 
  title, 
  inputs = [], 
  outputs = [], 
  children,
  className = '',
  style = {}
}) => {
  const removeNode = useStore((state) => state.removeNode);

  useEffect(() => {
    logger.debug(`Node rendered/mounted`, { nodeId: id, nodeType: title });
  }, [id, title]);

  const handleDelete = (e) => {
    e.stopPropagation(); // prevent drag or select
    logger.info(`Deleting node`, { nodeId: id });
    if (removeNode) {
      removeNode(id);
    }
  };

  return (
    <div className={`node-base ${className}`} style={style}>
      {/* Node Header */}
      <div className="node-header">
        <span>{title}</span>
        <button onClick={handleDelete} className="node-delete-btn" title="Delete Node">×</button>
      </div>

      {/* Node Content */}
      <div className="node-content">
        {children}
      </div>

      {/* Target Handles (Inputs) */}
      {inputs.map((handle, index) => (
        <Handle
          key={`input-${handle.id || index}`}
          type="target"
          position={handle.position || Position.Left}
          id={handle.id || `target-${index}`}
          style={handle.style || {}}
          className="handle target-handle"
        />
      ))}

      {/* Source Handles (Outputs) */}
      {outputs.map((handle, index) => (
        <Handle
          key={`output-${handle.id || index}`}
          type="source"
          position={handle.position || Position.Right}
          id={handle.id || `source-${index}`}
          style={handle.style || {}}
          className="handle source-handle"
        />
      ))}
    </div>
  );
};
