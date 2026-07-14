import { BaseNode } from './BaseNode';
import { Position } from 'reactflow';

export const TransformNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      title="Data Transform"
      inputs={[{ id: 'inputData', position: Position.Left }]}
      outputs={[{ id: 'outputData', position: Position.Right }]}
      className="node-transform"
    >
      <div>Transforms JSON payload</div>
    </BaseNode>
  );
};
