import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { Position } from 'reactflow';

export const SlackNode = ({ id, data }) => {
  const [channel, setChannel] = useState(data?.channel || '#general');

  return (
    <BaseNode
      id={id}
      title="Slack Notification"
      inputs={[{ id: 'trigger', position: Position.Left }]}
      outputs={[]} // No outputs needed
      className="node-slack"
    >
      <label>
        Channel:
        <input type="text" value={channel} onChange={(e) => setChannel(e.target.value)} />
      </label>
    </BaseNode>
  );
};
