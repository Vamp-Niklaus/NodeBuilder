import { BaseNode } from './BaseNode';
import { Position } from 'reactflow';

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      title="LLM"
      inputs={[
        { id: 'system', position: Position.Left, style: { top: `${100/3}%` } },
        { id: 'prompt', position: Position.Left, style: { top: `${200/3}%` } }
      ]}
      outputs={[{ id: 'response', position: Position.Right }]}
      className="node-llm"
    >
      <div>
        <span>This is a LLM.</span>
      </div>
    </BaseNode>
  );
};
