def count_ways_to_form_design(design, patterns):
 
    dp = [0] * (len(design) + 1)
    dp[0] = 1   

    
    for i in range(len(design)):
        if dp[i] > 0:   
            for pattern in patterns:
              
                if design[i:i + len(pattern)] == pattern:
                    dp[i + len(pattern)] += dp[i]

   
    return dp[len(design)]


def solve():
    
    with open("input.txt") as f:
       
        patterns = f.readline().strip().split(", ")
        
       
        f.readline()
        
   
        designs = [line.strip() for line in f.readlines()]

 
    total_ways = 0
    for design in designs:
        total_ways += count_ways_to_form_design(design, patterns)

 
    print(f"Total number of ways to form all designs: {total_ways}")


if __name__ == "__main__":
    solve()
