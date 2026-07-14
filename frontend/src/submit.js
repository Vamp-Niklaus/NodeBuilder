import { useStore } from './store';
import { useState } from 'react';
import { logger } from './utils/logger';

export const SubmitButton = () => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const [modalInfo, setModalInfo] = useState(null);

    const handleSubmit = async () => {
        logger.info('Submitting pipeline...', { numNodes: nodes.length, numEdges: edges.length });
        
        try {
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nodes, edges })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            logger.info('Pipeline parsing result', data);
            setModalInfo(data);
        } catch (error) {
            logger.error('Error submitting pipeline', error);
            alert('Failed to connect to the backend.');
        }
    };

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <button 
                type="button" 
                onClick={handleSubmit}
                style={{
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
            >
                Submit
            </button>

            {modalInfo && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '24px',
                        borderRadius: '12px',
                        minWidth: '300px',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        color: '#1e293b'
                    }}>
                        <h2 style={{marginTop: 0, color: '#1e293b'}}>Pipeline Result</h2>
                        <div style={{margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '8px'}}>
                            <div><strong>Number of Nodes:</strong> {modalInfo.num_nodes}</div>
                            <div><strong>Number of Edges:</strong> {modalInfo.num_edges}</div>
                            <div>
                                <strong>Is DAG:</strong>{' '}
                                <span style={{
                                    color: modalInfo.is_dag ? '#16a34a' : '#dc2626',
                                    fontWeight: 'bold'
                                }}>
                                    {modalInfo.is_dag ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setModalInfo(null)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                backgroundColor: '#e2e8f0',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 500,
                                color: '#1e293b'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
