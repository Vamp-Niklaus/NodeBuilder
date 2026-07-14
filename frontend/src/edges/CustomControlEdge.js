import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from 'reactflow';
import { useStore } from '../store';
import { logger } from '../utils/logger';

export default function CustomControlEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}) {
  const removeEdge = useStore((state) => state.removeEdge);
  
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleDelete = (evt) => {
    evt.stopPropagation();
    logger.info("Edge successfully unlinked via explicit user interaction", { edgeId: id });
    removeEdge(id);
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} interactionWidth={20} />
      
      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <button className="edge-delete-btn" onClick={handleDelete} title="Delete connection">
              ×
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
