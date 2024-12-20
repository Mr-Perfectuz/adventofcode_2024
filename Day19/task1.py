def can_form_design(design, patterns):
   
    dp = [False] * (len(design) + 1)
    dp[0] = True   
 
    for i in range(len(design)):
        if dp[i]:  
            for pattern in patterns:
 
                if design[i:i + len(pattern)] == pattern:
                    dp[i + len(pattern)] = True
 
    return dp[len(design)]


def solve():
 
    with open("input.txt") as f:
         
        patterns = f.readline().strip().split(", ")
       
        f.readline()
       
        designs = [line.strip() for line in f.readlines()]

     
    possible_designs_count = 0
    for design in designs:
        if can_form_design(design, patterns):
            possible_designs_count += 1

    
    print(f"Number of possible designs: {possible_designs_count}")


if __name__ == "__main__":
    solve()
