// Declare myGame, the object that contains our game's states
const myGame = {
    width: 800,
    height: 600,
    //Define our game states
    scenes: [],

    // Define common framerate to be referenced in animations
    frameRate: 20
};

const cellTypes = {
    BLOCK: -2,  // this block cannot be passed or have anything on it
    BASE: -1,
    OPEN: 0,
    TOWER: 1,
};




const cellSize = {width: 40, height: 40};
const enemyEnterCoord = {x: (myGame.height / cellSize.height) - 1, y: 1};
const btmLeft = {x: 0, y: (myGame.height / cellSize.height) - 1};  // the bottom left cell of the grid. where the base is
const baseEntrance = {x: btmLeft.x + 1, y: btmLeft.y - 1};

const grid = [];
(() => {
    for (let i = 0; i < myGame.height / cellSize.height; i++) {
        grid[i] = [];
        for (let j = 0; j < myGame.width / cellSize.width; j++) {
            if (i === 0 || j === 0 || i === (myGame.height / cellSize.height) - 1 || (i !== enemyEnterCoord.y && j === (myGame.width / cellSize.width) - 1)) {
                // add BLOCKs to top, bottom, left, and right. Except the second one down on the right
                grid[i][j] = cellTypes.BLOCK;
            } else {
                grid[i][j] = cellTypes.OPEN;
            }
        }
    }
    // game and cell size must allow base to fit in 2x2 cells in bottom left corner
    // overrides some BLOCKs
    grid[btmLeft.y][btmLeft.x] = cellTypes.BASE;
    grid[btmLeft.y][btmLeft.x + 1] = cellTypes.BASE;
    grid[btmLeft.y - 1][btmLeft.x] = cellTypes.BASE;
    grid[btmLeft.y - 1][btmLeft.x + 1] = cellTypes.BASE;
})();
console.log(grid);

/**
 * return a weighted graph to be used in astar
 * @author: jk
 * @returns {[]}
 */
function getGraph() {
    const graph = [];
    for (let i = 0; i < grid.length; i++) {  // height
        graph[i] = [];
        for (let j = 0; j < grid[i].length; j++) {  // width
            switch (grid[i][j]) {
                case cellTypes.BLOCK:
                case cellTypes.TOWER:
                    graph[i][j] = 0;  // impassible (infinity wight)
                    break;
                case cellTypes.OPEN:
                case cellTypes.BASE:
                    graph[i][j] = 1;
                    break;
            }
        }
    }
    return graph;
}

function getPath(startCoord) {
    const graphData = getGraph();
    console.log("graph data:", graphData);
    const graph = new Graph(graphData, {diagonal: true});
    const start = graph.grid[startCoord.y][startCoord.x];
    const end = graph.grid[baseEntrance.y][baseEntrance.x];
    const path = astar.search(graph, start, end, {heuristic: astar.heuristics.diagonal});
    console.log("path:", path);
    return path;
}