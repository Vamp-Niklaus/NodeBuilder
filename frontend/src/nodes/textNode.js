import { useState, useRef, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { Position, useUpdateNodeInternals } from 'reactflow';
import { logger } from '../utils/logger';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    // Auto-resize the textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    
    // Parse variables
    const regex = /{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}/g;
    let match;
    const foundVariables = new Set();
    while ((match = regex.exec(currText)) !== null) {
      foundVariables.add(match[1]);
    }
    
    const newVariables = Array.from(foundVariables);
    
    // Update local state and notify ReactFlow of new handles
    if (JSON.stringify(newVariables) !== JSON.stringify(variables)) {
      logger.info('TextNode variables updated', { id, variables: newVariables });
      setVariables(newVariables);
      // We wrap it in setTimeout to ensure it runs after the state settles and handles render
      setTimeout(() => updateNodeInternals(id), 0);
    }
  }, [currText, id, variables, updateNodeInternals]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  // Generate dynamic inputs based on variables
  const dynamicInputs = variables.map((variable, index) => ({
    id: variable,
    position: Position.Left,
    // Distribute handles evenly along the left edge
    style: { top: `${((index + 1) * 100) / (variables.length + 1)}%` }
  }));

  return (
    <BaseNode
      id={id}
      title="Text"
      inputs={dynamicInputs}
      outputs={[{ id: 'output', position: Position.Right }]}
      className="node-text"
      style={{ minWidth: 250 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <label style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          Text:
          <textarea 
            ref={textareaRef}
            value={currText} 
            onChange={handleTextChange} 
            className="nodrag"
            style={{ 
              width: '100%', 
              boxSizing: 'border-box', 
              margin: '4px 0 0 0', 
              resize: 'none', 
              overflow: 'hidden' 
            }}
          />
        </label>
      </div>
    </BaseNode>
  );
};
