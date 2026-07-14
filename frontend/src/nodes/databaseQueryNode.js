import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { Position } from 'reactflow';

export const DatabaseQueryNode = ({ id, data }) => {
  const [query, setQuery] = useState(data?.query || 'SELECT * FROM users;');

  return (
    <BaseNode
      id={id}
      title="Database Query"
      inputs={[{ id: 'connection', position: Position.Left }]}
      outputs={[{ id: 'results', position: Position.Right }]}
      className="node-database"
      style={{ minWidth: 220 }}
    >
      <label>
        SQL Query:
        <textarea value={query} onChange={(e) => setQuery(e.target.value)} className="nodrag" />
      </label>
    </BaseNode>
  );
};
