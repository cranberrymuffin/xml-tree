import React, { useRef, useState, useEffect, useCallback } from 'react';
import Tree from 'react-d3-tree';
import './TreeVisualization.css';
import * as d3 from 'd3';

function TreeVisualization({ treeData, resetData }) {
  const containerRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions on resize
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  const isValidTreeData = data => data?.name && Array.isArray(data.children);

  // Correctly calculate tree dimensions using D3 layout matching react-d3-tree's configuration
  const getTreeSize = data => {
    if (!isValidTreeData(data)) return { width: 0, height: 0, minX: 0 };

    const treeLayout = d3
      .tree()
      .nodeSize([150, 150])
      .separation((a, b) => (a.parent === b.parent ? 2 : 3));

    const root = d3.hierarchy(data);
    treeLayout(root);

    const nodes = root.descendants();
    const minX = d3.min(nodes, d => d.x);
    const maxX = d3.max(nodes, d => d.x);
    const maxY = d3.max(nodes, d => d.y);

    return {
      width: maxX - minX,
      height: maxY,
      minX,
    };
  };

  const renderTree = () => {
    if (!treeData || !dimensions.width || !dimensions.height) {
      return <div>Loading tree...</div>;
    }

    const {
      width: treeWidth,
      height: treeHeight,
      minX,
    } = getTreeSize(treeData);

    if (treeWidth <= 0 || treeHeight <= 0) {
      return <div>Invalid tree data</div>;
    }

    // Calculate scale to fit the tree within container dimensions
    const scale = Math.min(
      dimensions.width / treeWidth,
      dimensions.height / treeHeight,
    );

    // Calculate translation to center the tree
    const translate = {
      x: (dimensions.width - treeWidth * scale) / 2 - minX * scale,
      y: dimensions.height / 2 - (treeHeight * scale) / 2,
    };

    return (
      <Tree
        data={treeData}
        orientation="vertical"
        translate={translate}
        scale={scale}
        nodeSize={{ x: 150, y: 150 }}
        renderCustomNodeElement={({ nodeDatum }) => (
          <g
            onMouseEnter={() => setHoveredNode(nodeDatum)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <circle r="20" className="node-circle" />
            <text x="25" y="5" className="node-text">
              {nodeDatum.name}
            </text>
            {hoveredNode === nodeDatum && (
              <text x="25" y="25" className="node-attribute-text">
                {nodeDatum.attributes?.data || ''}
              </text>
            )}
          </g>
        )}
      />
    );
  };

  return (
    <div className="tree-container">
      <div ref={containerRef} id="treeWrapper">
        {renderTree()}
      </div>
      <button onClick={resetData} className="parse-button">
        Edit XML
      </button>
    </div>
  );
}

export default TreeVisualization;
