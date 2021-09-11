"use strict";

/**
 * Execute a breadth-first algorithm for traversing the graph data structures
 *
 * @param {array} graph a matrix rapresenting tha adjaceny map
 * @param {number} startNode
 * @param {number} targetNode
 */
const bfs = function(graph, startNode, targetNode) {
  let parents = [];
  let queue = [];
  let visited = [];
  let current;

  queue.push(startNode);
  parents[startNode] = null;
  visited[startNode] = true;

  while (queue.length) {
    current = queue.shift();

    if (current === targetNode) {
      let path = computePath(parents, targetNode);
      return path;
    }

    for (let i = 0; i < graph.length; i++) {
      if (i !== current && graph[current][i] && !visited[i]) {
        parents[i] = current;
        visited[i] = true;
        queue.push(i);
      }
    }
  }

  return null;
};

/**
 * Computes the path to target node
 *
 * @param {array} parents
 * @param {number} targetNode
 */
const computePath = function(parents, targetNode) {
  let result = [targetNode];

  while (parents[targetNode] !== null) {
    targetNode = parents[targetNode];
    result.push(targetNode);
  }
  return result.reverse();
};

module.exports = {
  bfs: bfs,
  computePath: computePath
};
