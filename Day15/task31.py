
 
def display_grid():
    for r in range(rows):
        for c in range(cols):
            if robot == (r,c):
                print('@', end='')
            elif (r,c) in walls:
                print('#', end= '')
            elif (r,c) in left_boxes:
                print('[', end='')
            elif (r,c) in right_boxes:
                print(']', end='')
            else:
                print('.', end='')
        print('')
    print('')


with open('input.txt', 'r') as f:
    map, moves = f.read().split('\n\n')

 
map_lines = map.split('\n')
rows = len(map_lines)
cols = len(map_lines[0]) * 2
walls = set()
left_boxes = set()
right_boxes = set()
for i, L in enumerate(map_lines):
    for j, c in enumerate(L):
        if c == '#':
            walls.add((i, 2 * j))
            walls.add((i, 2 * j + 1))
        elif c == 'O':
            left_boxes.add((i, 2 * j))
            right_boxes.add((i, 2 * j + 1))
        elif c == '@':
            robot = (i, 2 * j)

 
move_lines = moves.split('\n')
for L in move_lines:
    for c in L:
        if c == '^':
        
            chain = {robot}
            boxes_to_process = set()
            i = robot[0]
            j = robot[1]
            i -= 1
            if (i,j) in walls:
                continue
            elif (i,j) in left_boxes:
                boxes_to_process.add((i,j))
                boxes_to_process.add((i,j+1))
            elif (i,j) in right_boxes:
                boxes_to_process.add((i,j-1))
                boxes_to_process.add((i,j))

            wall_flag = False
            while(boxes_to_process):
                b = boxes_to_process.pop()
                chain.add(b)
                i = b[0]
                j = b[1]
                i -= 1
                if (i,j) in walls:
                    wall_flag = True
                    continue
                elif (i,j) in left_boxes:
                    boxes_to_process.add((i,j))
                    boxes_to_process.add((i,j+1))
                elif (i,j) in right_boxes:
                    boxes_to_process.add((i,j))
                    boxes_to_process.add((i,j-1))
            if wall_flag:
                continue

            
            old_left_boxes = set()
            new_left_boxes = set()
            old_right_boxes = set()
            new_right_boxes = set()
            for b in chain:
                if b == robot:
                    new_robot = (robot[0] - 1, robot[1])
                elif b in left_boxes:
                    old_left_boxes.add(b)
                    new_left_boxes.add((b[0] - 1, b[1]))
                else:
                    old_right_boxes.add(b)
                    new_right_boxes.add((b[0] - 1, b[1]))   
            robot = new_robot
            left_boxes -= old_left_boxes
            left_boxes |= new_left_boxes
            right_boxes -= old_right_boxes
            right_boxes |= new_right_boxes

        elif c == '>':
           
            chain = [robot]
            i = robot[0]
            j = robot[1]
            j += 1
            while (i,j) in left_boxes:
                chain.insert(0, (i,j))
                chain.insert(0, (i,j+1))
                j += 2
           
            if not (i,j) in walls:
                for b in chain[:-1:2]:
                    right_boxes.remove(b)
                    right_boxes.add((b[0], b[1] + 1))
                    left_boxes.remove((b[0], b[1] - 1))
                    left_boxes.add((b[0], b[1]))
                robot = (robot[0], robot[1] + 1)

        elif c == 'v':
             
            chain = {robot}
            boxes_to_process = set()
            i = robot[0]
            j = robot[1]
            i += 1
            if (i,j) in walls:
                continue
            elif (i,j) in left_boxes:
                boxes_to_process.add((i,j))
                boxes_to_process.add((i,j+1))
            elif (i,j) in right_boxes:
                boxes_to_process.add((i,j-1))
                boxes_to_process.add((i,j))

            wall_flag = False
            while(boxes_to_process):
                b = boxes_to_process.pop()
                chain.add(b)
                i = b[0]
                j = b[1]
                i += 1
                if (i,j) in walls:
                    wall_flag = True
                    continue
                elif (i,j) in left_boxes:
                    boxes_to_process.add((i,j))
                    boxes_to_process.add((i,j+1))
                elif (i,j) in right_boxes:
                    boxes_to_process.add((i,j))
                    boxes_to_process.add((i,j-1))
            if wall_flag:
                continue

            # move chain of objects downward one space
            old_left_boxes = set()
            new_left_boxes = set()
            old_right_boxes = set()
            new_right_boxes = set()
            for b in chain:
                if b == robot:
                    new_robot = (robot[0] + 1, robot[1])
                elif b in left_boxes:
                    old_left_boxes.add(b)
                    new_left_boxes.add((b[0] + 1, b[1]))
                else:
                    old_right_boxes.add(b)
                    new_right_boxes.add((b[0] + 1, b[1]))   
            robot = new_robot
            left_boxes -= old_left_boxes
            left_boxes |= new_left_boxes
            right_boxes -= old_right_boxes
            right_boxes |= new_right_boxes

        else:      
            
            chain = [robot]
            i = robot[0]
            j = robot[1]
            j -= 1

            while (i,j) in right_boxes:
                chain.insert(0, (i,j))
                chain.insert(0, (i,j-1))
                j -= 2
          
            if not (i,j) in walls:
                for b in chain[:-1:2]:
                    left_boxes.remove(b)
                    left_boxes.add((b[0], b[1] - 1))
                    right_boxes.remove((b[0], b[1] + 1))
                    right_boxes.add(b)
                robot = (robot[0], robot[1] - 1)

 
total = 0
for b in left_boxes:
    total += 100 * b[0] + b[1]
print(total)