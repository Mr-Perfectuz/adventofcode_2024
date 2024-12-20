import re

# The given input
input_data = """
Register A: 51064159
Register B: 0
Register C: 0

Program: 2,4,1,5,7,5,1,6,0,3,4,6,5,5,3,0
"""

# Parsing the input
regs, program_str = input_data.strip().split('\n\n')
A, B, C = [int(x.split(': ')[1]) for x in regs.split('\n')]
program = list(map(int, program_str.split(': ')[1].split(',')))

def run(Ast, part2):
    def getCombo(x):
        if x in [0, 1, 2, 3]:
            return x
        if x == 4:
            return A
        if x == 5:
            return B
        if x == 6:
            return C
        return -1

    A = Ast
    B = 0
    C = 0
    ip = 0
    out = []
    while True:
        if ip >= len(program):
            return out
        cmd = program[ip]
        op = program[ip + 1]
        combo = getCombo(op)

        if cmd == 0:
            A = A // 2**combo
            ip += 2
        elif cmd == 1:
            B = B ^ op
            ip += 2
        elif cmd == 2:
            B = combo % 8
            ip += 2
        elif cmd == 3:
            if A != 0:
                ip = op
            else:
                ip += 2
        elif cmd == 4:
            B = B ^ C
            ip += 2
        elif cmd == 5:
            out.append(int(combo % 8))
            if part2 and out[len(out) - 1] != program[len(out) - 1]:
                return out
            ip += 2
        elif cmd == 6:
            B = A // 2**combo
            ip += 2
        elif cmd == 7:
            C = A // 2**combo
            ip += 2

# Part 1
part1 = run(A, False)
print("Part 1 Output:", ','.join([str(x) for x in part1]))

# Part 2 - Searching for the correct A
Ast = 0
best = 0
while True:
    Ast += 1
    A = Ast * 8**9 + 0o676236017
    out = run(A, True)
    if out == program:
        print("Part 2 Result:", A)
        break
    elif len(out) > best:
        best = len(out)
