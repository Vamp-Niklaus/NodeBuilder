import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { BackendAPINode } from './nodes/backendAPINode';
import { DatabaseQueryNode } from './nodes/databaseQueryNode';
import { ConditionalNode } from './nodes/conditionalNode';
import { TransformNode } from './nodes/transformNode';
import { SlackNode } from './nodes/slackNode';
import { logger } from './utils/logger';
import CustomControlEdge from './edges/CustomControlEdge';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  backendAPI: BackendAPINode,
  databaseQuery: DatabaseQueryNode,
  conditional: ConditionalNode,
  transform: TransformNode,
  slack: SlackNode,
};

const edgeTypes = {
  customControlEdge: CustomControlEdge
};

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const getNodeID = useStore((state) => state.getNodeID);
    const addNode = useStore((state) => state.addNode);
    const removeEdge = useStore((state) => state.removeEdge);
    const onNodesChange = useStore((state) => state.onNodesChange);
    const onEdgesChange = useStore((state) => state.onEdgesChange);
    const onConnect = useStore((state) => state.onConnect);
    const onEdgeUpdate = useStore((state) => state.onEdgeUpdate);

    // Track edge drag mechanics for "yank" gesture vs safe snap-back
    const edgeUpdateSuccessful = useRef(true);
    const edgeDragStart = useRef({ x: 0, y: 0 });

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    // Prevent connecting a node to itself (prevents infinite loops)
    const isValidConnection = useCallback(
        (connection) => connection.source !== connection.target,
        []
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance]
    );

    const onEdgeUpdateStart = useCallback((event, edge, handleType) => {
      edgeUpdateSuccessful.current = false;
      edgeDragStart.current = { x: event.clientX, y: event.clientY };
    }, []);

    const handleEdgeUpdate = useCallback((oldEdge, newConnection) => {
      edgeUpdateSuccessful.current = true;
      onEdgeUpdate(oldEdge, newConnection);
    }, [onEdgeUpdate]);

    const onEdgeUpdateEnd = useCallback((event, edge, handleType) => {
        if (!edgeUpdateSuccessful.current) {
            const dx = event.clientX - edgeDragStart.current.x;
            const dy = event.clientY - edgeDragStart.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // "Yank" gesture threshold: small movement < 50px
            if (distance < 50) {
                logger.info("Edge successfully unlinked via explicit user interaction (yank gesture)", { edgeId: edge.id });
                removeEdge(edge.id);
            }
        }
        edgeUpdateSuccessful.current = true;
    }, [removeEdge]);

    return (
        <>
        <div ref={reactFlowWrapper} style={{width: '100vw', height: '70vh', position: 'relative'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                edgesUpdatable={true}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onEdgeUpdate={handleEdgeUpdate}
                onEdgeUpdateStart={onEdgeUpdateStart}
                onEdgeUpdateEnd={onEdgeUpdateEnd}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
            >
                <Background color="#aaa" gap={gridSize} />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
        </>
    )
}
