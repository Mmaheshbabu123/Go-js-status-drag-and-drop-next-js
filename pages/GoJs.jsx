import React,{useState} from 'react';

import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

import './styles.css';  // contains .diagram-component CSS

// ...

/**
 * Diagram initialization method, which is passed to the ReactDiagram component.
 * This method is responsible for making the diagram and initializing the model and any templates.
 * The model's data should not be set here, as the ReactDiagram component handles that via the other props.
 */







// render function...
const App = () => {

const [state,setState]= useState({
  nodeDataArray:[

  ],
  linkedArray:[],
  tasks:[
  {
    id: 1,
    name: "New",
    done: false
  },
  {
    id: 2,
    name: "Open",
    done: false
  },
  {
    id: 3,
    name: "Assigned",
    done: false
  },
  {
    id: 4,
    name: "Reject",
    done: false
  },
  {
    id: 5,
    name: "Duplicate",
    done: false
  },
  {
    id: 6,
    name: "Future",
    done: false
  },
  {
    id: 7,
    name: "In progress",
    done: false
  }
],

});
function nodeClicked(e, node) {
  // e is the input event
  // node is the clicked node
  // Call your method here
  console.log("Node clicked:", node.data.text);
}
function handleNodeDeletion (node) {
  console.log("Node clicked:",node);
}
function initDiagram() {
 const $ = go.GraphObject.make;
 // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
 const diagram = $(go.Diagram, {
   'undoManager.isEnabled': true,  // must be set to allow for model change listening
    "commandHandler.deletesTree": false,
  //  "commandHandler.canDeleteSelection": onDeleteNode,
   'clickCreatingTool.archetypeNodeData': null,
   model: $(go.GraphLinksModel, {
     linkKeyProperty: 'key',  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
     // positive keys for nodes
     makeUniqueKeyFunction: (m, data) => {
       let k = data.key || 1;
       while (m.findNodeDataForKey(k)) k++;
       data.key = k;
       return k;
     },
     // negative keys for links
     makeUniqueLinkKeyFunction: (m, data) => {
       let k = data.key || -1;
       while (m.findLinkDataForKey(k)) k--;
       data.key = k;
       return k;
     }
   })
 });
 diagram.contextMenu = null; // to disable edit delete
 // Customize Toolbar Buttons
 diagram.toolManager.mouseDownTools.each(tool => {
   if (tool.name === "ContextMenuButton") {
     tool.isEnabled = false; // Disable context menu button
   }
 });
 diagram.toolManager.dragSelectingTool.isEnabled = false; // Disable selection rectangle
 diagram.toolManager.clickCreatingTool.isEnabled = false; // Disable creating new nodes by clicking
 diagram.toolManager.draggingTool = new go.DraggingTool();
 diagram.toolManager.draggingTool.dragsLink = false; // Disable dragging links
 diagram.toolManager.draggingTool.isGridSnapEnabled = true;

 // Define a simple Node template
 diagram.nodeTemplate =
   $(go.Node, 'Auto',  // the Shape will go around the TextBlock
   { click: nodeClicked },
     new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
     $(go.Shape, 'RoundedRectangle',
       {
         name: 'SHAPE', fill: 'lightgray', strokeWidth: 0,
         // set the port properties:
         portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer'
       },
       // Shape.fill is bound to Node.data.color
       new go.Binding('fill', 'color')),
     $(go.TextBlock,
       { margin: 8, editable: false, font: '400 .875rem Roboto, sans-serif' },  // some room around the text
       new go.Binding('text').makeTwoWay()
     )
   );

 // Define the Link template with serpentine effect
 diagram.linkTemplate =
   $(go.Link,
     {
       routing: go.Link.AvoidsNodes,  // avoid nodes
       curve: go.Link.JumpGap,  // use a curved link
       curviness: 20,  // control the amount of curve
       corner: 10,  // rounded corners
       toShortLength: 4,  // shorten the end points
       relinkableFrom: true, relinkableTo: true,  // allow relinking
       reshapable: true,  // allow reshaping
       resegmentable: true  // allow resegmenting
     },
     $(go.Shape),  // the link path shape
     $(go.Shape, { toArrow: 'Standard' })  // the arrowhead
   );

 return diagram;
}
function updateNodeDataArray(prevState, modifiedNodeData) {
    const updatedNodeDataArray = prevState.nodeDataArray.map(node => {
        const modifiedNode = modifiedNodeData.find(modifiedNode => modifiedNode.key === node.key);
        if (modifiedNode) {
            return { ...node, loc: modifiedNode.loc };
        }
        return node;
    });
     setState(prevState => ({...prevState,nodeDataArray: updatedNodeDataArray}));
  //  return { ...prevState, nodeDataArray: updatedNodeDataArray };
}
  /**
   * This function handles any changes to the GoJS model.
   * It is here that you would make any updates to your React state, which is dicussed below.
   */
  function handleModelChange(changes) {
    console.log('changes', changes);
     const { modifiedNodeData,modifiedLinkData,removedLinkKeys ,removedNodeKeys} = changes;

     if (modifiedNodeData) { // drag n drop nodes
       setState(prevState => {
        // Use prevState as the previous state
        updateNodeDataArray(prevState, modifiedNodeData);
        return prevState; // Return the previous state unchanged
    });
     }
     if(modifiedLinkData) { // add linked data
       const {linkedArray} = state;
       console.log(state);
       console.log(linkedArray)
       modifiedLinkData.map(item => {
         linkedArray.push(item);
       });
       setState(prevState => ({ ...prevState, linkedArray: linkedArray }));
     }
     if(removedLinkKeys) {
       const {linkedArray} = state;
       console.log(state);
       console.log(linkedArray)
       let finaldata = linkedArray.filter(item => !removedLinkKeys.includes(item.key) );
      setState(prevState => ({ ...prevState, linkedArray: finaldata }));
     }
     if(removedNodeKeys) {
        const {nodeDataArray} = state; 
        let updateNodeDataArray = {...nodeDataArray}

     }
  }
  const onDragStart = (evt) => {
    let element = evt.currentTarget;
    element.classList.add("dragged");
    evt.dataTransfer.setData("text/plain", evt.currentTarget.id);
    evt.dataTransfer.effectAllowed = "move";
  };
const  onDragEnd = (evt) => {
    evt.currentTarget.classList.remove("dragged");
  };
const  onDragEnter = (evt) => {
    evt.preventDefault();
    let element = evt.currentTarget;
    element.classList.add("dragged-over");
    evt.dataTransfer.dropEffect = "move";
  };
const  onDragLeave = (evt) => {
    let currentTarget = evt.currentTarget;
    let newTarget = evt.relatedTarget;
    if (newTarget.parentNode === currentTarget || newTarget === currentTarget)
      return;
    evt.preventDefault();
    let element = evt.currentTarget;
    element.classList.remove("dragged-over");
  };
const   onDragOver = (evt) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  };
const  onDrop = (evt, value) => {
        evt.preventDefault();
        evt.currentTarget.classList.remove("dragged-over");
        let data = evt.dataTransfer.getData("text/plain");
        console.log(data)
        let tasks = state.tasks;
        let updated = tasks.map((task) => {
          if (task.id == data) task.done = value;
          return task;
        });
        let getDropObj = tasks.filter((task) => task.id == data);
    const { nodeDataArray, linkedArray } = state;

// Create a new array with the updated node data
const updatedNodeDataArray = [...nodeDataArray]; // Copy the existing array

    getDropObj.forEach(task => {
      updatedNodeDataArray.push({ key: task.id, text: task.name, loc: '0 100' }); // Add new nodes
    });

    // Update the state with the new node data array
    setState(prevState => ({
      ...prevState,
      tasks: updated, // Assuming 'updated' is defined somewhere
      nodeDataArray: updatedNodeDataArray // Set the new node data array
    }));

  };
  const { tasks } = state;
  let pending = tasks.filter((t) => !t.done);
  let done = tasks.filter((t) => t.done);
  console.log(state);
  console.log('linkedDataaa')
  console.log(state.linkedArray)
  console.log('nodeDataaa');
  console.log(state.nodeDataArray)
  return (
      <div className="container">
        <div
          className="pending small-box"
          onDragLeave={(e) => onDragLeave(e)}
          onDragEnter={(e) => onDragEnter(e)}
          onDragEnd={(e) => onDragEnd(e)}
          onDragOver={(e) => onDragOver(e)}
          onDrop={(e) => onDrop(e, false)}
        >

    <h3>Todo status</h3>
        {pending.map((task) => (
          <div
            className="task"
            key={task.name}
            id={task.id}
            draggable
            onDragStart={(e) =>onDragStart(e)}
            onDragEnd={(e) => onDragEnd(e)}
          >
            {task.name}
          </div>
        ))}
      </div>
      <div
         className="done small-box"
         onDragLeave={(e) => onDragLeave(e)}
         onDragEnter={(e) => onDragEnter(e)}
         onDragEnd={(e) => onDragEnd(e)}
         onDragOver={(e) => onDragOver(e)}
         onDrop={(e) => onDrop(e, true)}
       >
      ...
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName='diagram-component'
        nodeDataArray={state.nodeDataArray}
        linkDataArray={state.linkedArray.length > 0 ? state.linkedArray : []}

        onModelChange={(event)=>handleModelChange(event)}
      />
      ...

      </div>
    </div>
  );
}

export default App;
