 

with open("input.txt", "r", encoding="utf-8") as f:
    input_list = f.read().splitlines()

answer1 = 0
answer2 = 0

start = (0, 0)
end = (0, 0)
maze = {}
cur_dir = (0, 1)
for i, line in enumerate(input_list):
    for j, char in enumerate(line):
        maze[(i, j)] = char
        if char == "S":
            start = (i, j)
            reindeer = (i, j)
        if char == "E":
            end = (i, j)

visited = {}
paths = [[0, cur_dir, start]]
all_paths = []
for _ in range(1000):
    temp_paths = []
    for path in sorted(paths):
        score = path[0]
        cur_dir = path[1]
        x, y = path[-1]
        for i, j in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            if (x + i, y + j) not in maze:
                continue
            if maze[(x + i, y + j)] == "#":
                continue
            temp = list(path)
            temp.append((x + i, y + j))
            temp[1] = (i, j)
            temp[0] += 1
            if cur_dir != (i, j):
                temp[0] += 1000
            if ((x + i, y + j), (i, j)) in visited and visited[((x + i, y + j), (i, j))] < temp[0]:
                continue
            visited[((x + i, y + j), (i, j))] = temp[0]
            temp_paths.append(temp)
            if end in temp:
                all_paths.append(temp)
    paths = temp_paths
answer1 = min(visited.get((end, (0, 1)), max(visited.values())), visited.get((end, (0, -1)), max(visited.values())),
              visited.get((end, (1, 0)), max(visited.values())), visited.get((end, (-1, 0)), max(visited.values())))
print("Answer 1:", answer1)

best_paths = [x for x in all_paths if x[0] == answer1]
best_tiles = set()
for best_path in best_paths:
    for path in best_path[2:]:
        best_tiles.add(path)
answer2 = len(best_tiles)
print("Answer 2:", answer2)
