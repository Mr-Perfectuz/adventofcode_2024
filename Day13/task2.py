with open('input.txt') as f:
    scenarios = f.read().split('\n\n')
    
def parse(scenario):
    output = {}
    a,b,prize = scenario.splitlines()
    output['A'] = [int(item.split('+')[1]) for item in a.split(':')[1].split(', ')]
    output['B'] = [int(item.split('+')[1]) for item in b.split(':')[1].split(', ')]
    output['Prize'] = [10000000000000+int(item.split('=')[1]) for item in prize.split(':')[1].split(', ')]
    return output

scenarios = [parse(scenario) for scenario in scenarios]

def solve(scenario):
    ax,ay = scenario['A']
    bx,by = scenario['B']
    tx,ty = scenario['Prize']
    b = (tx*ay-ty*ax)//(ay*bx-by*ax)
    a = (tx*by-ty*bx)//(by*ax-bx*ay)
    if ax*a+bx*b==tx and ay*a+by*b==ty:
        return 3*a+b
    else:
        return 0
                
answer = sum(solve(scenario) for scenario in scenarios)
print(answer)