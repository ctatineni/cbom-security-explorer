
import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CryptoNode } from './CryptoNode';
import { LibraryNode } from './LibraryNode';
import { ApplicationNode } from './ApplicationNode';

const nodeTypes = {
  crypto: CryptoNode,
  library: LibraryNode,
  application: ApplicationNode,
};

interface CBOMGraphProps {
  data: any;
  onNodeSelect: (nodeData: any) => void;
  selectedNode: any;
}

export const CBOMGraph: React.FC<CBOMGraphProps> = ({ data, onNodeSelect, selectedNode }) => {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Application node (center)
    nodes.push({
      id: 'app',
      type: 'application',
      position: { x: 400, y: 300 },
      data: {
        label: data.application.name,
        version: data.application.version,
        risk: data.application.riskLevel,
      },
    });

    // Crypto algorithms
    data.cryptoAlgorithms.forEach((algo, index) => {
      const angle = (index * 2 * Math.PI) / data.cryptoAlgorithms.length;
      const radius = 250;
      const x = 400 + radius * Math.cos(angle);
      const y = 300 + radius * Math.sin(angle);

      nodes.push({
        id: `crypto-${algo.id}`,
        type: 'crypto',
        position: { x: x - 75, y: y - 40 },
        data: {
          ...algo,
        },
      });

      edges.push({
        id: `app-crypto-${algo.id}`,
        source: 'app',
        target: `crypto-${algo.id}`,
        type: 'smoothstep',
        style: {
          stroke: algo.riskLevel === 'high' ? '#ef4444' : 
                  algo.riskLevel === 'medium' ? '#f59e0b' : '#10b981',
        },
      });
    });

    // Libraries
    data.libraries.forEach((lib, index) => {
      const angle = (index * 2 * Math.PI) / data.libraries.length + Math.PI / 4;
      const radius = 400;
      const x = 400 + radius * Math.cos(angle);
      const y = 300 + radius * Math.sin(angle);

      nodes.push({
        id: `lib-${lib.id}`,
        type: 'library',
        position: { x: x - 75, y: y - 40 },
        data: {
          ...lib,
        },
      });

      edges.push({
        id: `app-lib-${lib.id}`,
        source: 'app',
        target: `lib-${lib.id}`,
        type: 'smoothstep',
        style: {
          stroke: '#64748b',
          strokeDasharray: '5,5',
        },
      });

      // Connect libraries to their crypto algorithms
      lib.algorithms.forEach(algoId => {
        edges.push({
          id: `lib-${lib.id}-crypto-${algoId}`,
          source: `lib-${lib.id}`,
          target: `crypto-${algoId}`,
          type: 'smoothstep',
          style: {
            stroke: '#94a3b8',
            strokeWidth: 1,
          },
        });
      });
    });

    return { nodes, edges };
  }, [data]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((event, node) => {
    onNodeSelect(node.data);
  }, [onNodeSelect]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.type) {
              case 'crypto': return '#3b82f6';
              case 'library': return '#8b5cf6';
              case 'application': return '#10b981';
              default: return '#64748b';
            }
          }}
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};
