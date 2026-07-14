import { BaseNode } from './BaseNode';
import { Position } from 'reactflow';

export const ConditionalNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      title="Conditional Split"
      inputs={[{ id: 'input', position: Position.Left }]}
      outputs={[
        { id: 'true', position: Position.Right, style: { top: '30%' } },
        { id: 'false', position: Position.Right, style: { top: '70%' } }
      ]}
      className="node-conditional"
    >
      <div>Evaluates condition</div>
    </BaseNode>
  );
};
