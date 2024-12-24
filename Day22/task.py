def mix(secret, value):
    """Mix a value into the secret number using XOR."""
    return secret ^ value

def prune(secret):
    """Prune the secret number using modulo 16777216."""
    return secret % 16777216

def generate_next_secret(secret):
    """Generate the next secret number using the specified rules."""
 
    result = mix(secret, secret * 64)
    result = prune(result)
    
 
    result = mix(result, result // 32)
    result = prune(result)
    
 
    result = mix(result, result * 2048)
    result = prune(result)
    
    return result

def find_nth_secret(initial_secret, n):
    """Find the nth new secret number for a given initial secret."""
    current = initial_secret
    for _ in range(n):
        current = generate_next_secret(current)
    return current

 
with open('input.txt', 'r') as file:
    initial_secrets = [int(line.strip()) for line in file]

target_n = 2000

 
results = []
for initial in initial_secrets:
    nth_secret = find_nth_secret(initial, target_n)
    results.append(nth_secret)

 
total = sum(results)
print(f"Sum of {target_n}th secrets: {total}")