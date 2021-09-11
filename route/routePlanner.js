"use strict";

const algorithm = require("../algorithm/bfs");

/**
 * Computes the path from the start room to the target rooms
 *
 * @param {array} adjacencyMap matrix representing the adjaceny map
 * @param {number} start start room, provided through the input
 * @param {array} target array containing the target rooms where the collecatble objects are contained
 */
function getRoute(adjacencyMap, start, target) {
  let route = [start];

  while (target.length) {
    let targetNode = target.pop();
    let path = algorithm.bfs(adjacencyMap, start, targetNode);

    if (!path) {
      return path;
    }
    // Remove the first element inside the computed path since it is
    // already stored in the route
    path.shift();
    route = route.concat(path);
    start = targetNode;
  }

  return route;
}

module.exports.getRoute = getRoute;
