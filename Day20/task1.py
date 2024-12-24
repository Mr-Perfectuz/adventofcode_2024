import networkx as nx
from typing import List, Set, Tuple, Dict
from itertools import product

def read_map(filename: str) -> List[List[str]]:
    with open(filename, 'r') as f:
        return [list(line.strip()) for line in f]

Point = Tuple[int, int]

def find_start_end(grid: List[List[str]]) -> Tuple[Point, Point]:
    start: Point = (-1, -1)
    end: Point = (-1, -1)
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == 'S':
                start = (i, j)
            elif grid[i][j] == 'E':
                end = (i, j)
    if start == (-1, -1) or end == (-1, -1):
        raise ValueError("Start or end position not found in grid")
    return start, end

def build_graph(grid: List[List[str]], allow_walls: bool = False) -> nx.Graph:
    """Build a graph representation of the grid."""
    G = nx.Graph()
    height, width = len(grid), len(grid[0])
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    
    for y, x in product(range(height), range(width)):
        if not allow_walls and grid[y][x] == '#':
            continue
        pos = (y, x)
        for dy, dx in directions:
            new_y, new_x = y + dy, x + dx
            if (0 <= new_y < height and 
                0 <= new_x < width and 
                (allow_walls or grid[new_y][new_x] in '.SE')):
                G.add_edge(pos, (new_y, new_x), weight=1)
    
    return G

def find_all_cheats(grid: List[List[str]], start: Point, end: Point, max_cheat_steps: int) -> List[int]:
    print("Building normal graph and finding shortest path...")
    G = build_graph(grid)
    try:
        normal_time = nx.shortest_path_length(G, start, end, weight='weight')
    except nx.NetworkXNoPath:
        return []
    print(f"Normal path length: {normal_time}")
    
    print("Building graph with wall passages...")
    G_walls = build_graph(grid, allow_walls=True)
    
    print("Pre-calculating distances...")
    start_distances = nx.single_source_dijkstra_path_length(G, start, weight='weight')
    end_distances = nx.single_source_dijkstra_path_length(G, end, weight='weight')
    
    saved_times = []
    height, width = len(grid), len(grid[0])
    max_end_dist = normal_time - 100 
    
    print("Finding cheats...")
    for y, x in product(range(height), range(width)):
        if grid[y][x] not in '.SE':
            continue
        start_pos = (y, x)
        if start_pos not in start_distances:
            continue
            
        start_dist = start_distances[start_pos]
        
        cheat_ends = nx.single_source_dijkstra_path_length(G_walls, start_pos, cutoff=max_cheat_steps)
        
        for end_pos, cheat_steps in cheat_ends.items():
            if grid[end_pos[0]][end_pos[1]] not in '.SE':
                continue
            if end_pos not in end_distances:
                continue
                
            end_dist = end_distances[end_pos]
            if end_dist > max_end_dist:
                continue
                
            cheat_time = start_dist + cheat_steps + end_dist
            time_saved = normal_time - cheat_time
            
            if time_saved >= 100:
                saved_times.append(time_saved)
    
    print(f"Found {len(saved_times)} cheats that save ≥100 picoseconds")
    return saved_times

def solve_part1(filename: str) -> int:
    grid = read_map(filename)
    start, end = find_start_end(grid)
    saved_times = find_all_cheats(grid, start, end, max_cheat_steps=2)
    return len(saved_times)

def solve_part2(filename: str) -> int:
    grid = read_map(filename)
    start, end = find_start_end(grid)
    saved_times = find_all_cheats(grid, start, end, max_cheat_steps=20)
    return len(saved_times)

if __name__ == "__main__":
    print("Part 1:", solve_part1("input.txt"))
    print("Part 2:", solve_part2("input.txt"))
