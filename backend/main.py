from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from collections import defaultdict
from logging_config import logger

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str
    type: str
    data: Optional[Dict[str, Any]] = None
    position: Optional[Dict[str, float]] = None

class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    logger.info(f"Received pipeline with {len(pipeline.nodes)} nodes and {len(pipeline.edges)} edges")
    
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    
    # Build adjacency list
    graph = defaultdict(list)
    for edge in pipeline.edges:
        graph[edge.source].append(edge.target)
        
    # Cycle detection using DFS
    def is_cyclic():
        visited = set()
        rec_stack = set()
        
        def dfs(node):
            visited.add(node)
            rec_stack.add(node)
            
            for neighbor in graph.get(node, []):
                if neighbor not in visited:
                    if dfs(neighbor):
                        return True
                elif neighbor in rec_stack:
                    return True
                    
            rec_stack.remove(node)
            return False
            
        for node in [n.id for n in pipeline.nodes]:
            if node not in visited:
                if dfs(node):
                    return True
        return False
        
    is_dag = not is_cyclic()
    
    result = {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag
    }
    logger.info(f"Pipeline parsed successfully: {result}")
    
    return result
