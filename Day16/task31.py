import heapq

def parse_maze(file_path):
    with open(file_path, 'r') as f:
        maze = [line.strip() for line in f.readlines()]
    return maze

def find_positions(maze):
    start, end = None, None
    for y, row in enumerate(maze):
        for x, cell in enumerate(row):
            if cell == 'S':
                start = (x, y)
            elif cell == 'E':
                end = (x, y)
    return start, end

def neighbors(pos, direction, maze):
    x, y = pos
    directions = ['N', 'E', 'S', 'W']
    dir_offsets = {
        'N': (0, -1),
        'E': (1, 0),
        'S': (0, 1),
        'W': (-1, 0)
    }
    
    results = []
    # Move forward
    dx, dy = dir_offsets[direction]
    nx, ny = x + dx, y + dy
    if maze[ny][nx] != '#':
        results.append(((nx, ny), direction, 1))
    
    # Rotate clockwise
    cw_direction = directions[(directions.index(direction) + 1) % 4]
    results.append(((x, y), cw_direction, 1000))
    
    # Rotate counterclockwise
    ccw_direction = directions[(directions.index(direction) - 1) % 4]
    results.append(((x, y), ccw_direction, 1000))

    return results

def heuristic(pos, end):
    return abs(pos[0] - end[0]) + abs(pos[1] - end[1])

def a_star(maze, start, end):
    directions = ['E', 'N', 'W', 'S']  
    start_state = (start, 'E', 0)   
    
    
    pq = [(heuristic(start, end), 0, start, 'E')]
    visited = set()

    while pq:
        est_cost, cost_so_far, pos, direction = heapq.heappop(pq)

        if (pos, direction) in visited:
            continue
        visited.add((pos, direction))

        if pos == end:
            return cost_so_far

        for next_pos, next_direction, move_cost in neighbors(pos, direction, maze):
            if (next_pos, next_direction) not in visited:
                next_cost = cost_so_far + move_cost
                heapq.heappush(pq, (next_cost + heuristic(next_pos, end), next_cost, next_pos, next_direction))

    return float('inf')

def main():
    maze = parse_maze('input.txt')
    start, end = find_positions(maze)
    min_score = a_star(maze, start, end)
    print("Lowest score:", min_score)

if __name__ == "__main__":
    main()
