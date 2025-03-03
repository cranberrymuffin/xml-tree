// App.js
import React, { useState } from 'react';
import XmlInput from './XmlInput';
import TreeVisualization from './TreeVisualization';
import { parseXML } from './parse';
import './App.css';

function App() {
  const [xmlInput, setXmlInput] = useState(`<book>
    <title>Introduction to Programming</title>
    <author>Aparna</author>
    <year>2025</year>
    <chapters>
        <title>One</title>
        <title>Two</title>
        <title>Three</title>
        <title>Four</title>
        <title>Five</title>
    </chapters>
</book>`);
  const [treeData, setTreeData] = useState(null);

  const handleParse = () => {
    try {
      const rootNode = parseXML(xmlInput, 0);
      const transformNode = node => {
        if (node.data !== '') {
          return {
            name: node.name,
            attributes: { data: node.data },
            children: node.children.map(transformNode),
          };
        }
        return {
          name: node.name,
          children: node.children.map(transformNode),
        };
      };
      setTreeData(transformNode(rootNode[0]));
    } catch (error) {
      console.error('Error parsing XML:', error);
    }
  };

  const resetData = () => {
    setTreeData(null);
  };

  return (
    <div>
      {!treeData ? (
        <XmlInput
          xmlInput={xmlInput}
          setXmlInput={setXmlInput}
          handleParse={handleParse}
        />
      ) : (
        <TreeVisualization treeData={treeData} resetData={resetData} />
      )}
    </div>
  );
}

export default App;
