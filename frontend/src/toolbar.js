// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                <DraggableNode type='backendAPI' label='API' />
                <DraggableNode type='databaseQuery' label='DB Query' />
                <DraggableNode type='conditional' label='Split' />
                <DraggableNode type='transform' label='Transform' />
                <DraggableNode type='slack' label='Slack' />
            </div>
        </div>
    );
};
