import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { Position } from 'reactflow';

export const BackendAPINode = ({ id, data }) => {
  const [endpoint, setEndpoint] = useState(data?.endpoint || 'https://api.example.com');

  return (
    <BaseNode
      id={id}
      title="Backend API"
      inputs={[{ id: 'trigger', position: Position.Left }]}
      outputs={[
        { id: 'data', position: Position.Right, style: { top: '30%' } },
        { id: 'error', position: Position.Right, style: { top: '70%' } }
      ]}
      className="node-backend-api"
    >
      <label>
        Endpoint:
        <input type="text" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} />
      </label>
    </BaseNode>
  );
};
