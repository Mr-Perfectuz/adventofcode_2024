from collections import deque

def read_input(file_path):
    with open(file_path, 'r') as file:
        return [tuple(map(int, line.strip().split(','))) for line in file]

def simulate_corruption(grid, corrupted_positions):
    for x, y in corrupted_positions:
        grid[y][x] = '#'

def bfs_shortest_path(grid, start, end):
    rows, cols = len(grid), len(grid[0])
    queue = deque([(start, 0)])  # (position, steps)
    visited = set()
    visited.add(start)

    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # Down, Right, Up, Left

    while queue:
        (x, y), steps = queue.popleft()

        if (x, y) == end:
            return steps

        for dx, dy in directions:
            nx, ny = x + dx, y + dy

            if 0 <= nx < cols and 0 <= ny < rows and grid[ny][nx] == '.' and (nx, ny) not in visited:
                visited.add((nx, ny))
                queue.append(((nx, ny), steps + 1))

    return -1  # No path found

def main():
   
    input_path = 'input.txt'
    corrupted_positions = read_input(input_path)

    
    size = 71
    grid = [['.' for _ in range(size)] for _ in range(size)]
 
    simulate_corruption(grid, corrupted_positions[:1024])

 
    start = (0, 0)
    end = (70, 70)
    min_steps = bfs_shortest_path(grid, start, end)

    print(f"The minimum number of steps needed to reach the exit is: {min_steps}")

if __name__ == "__main__":
    main()
