from collections import defaultdict
from itertools import combinations

def read_network_map(filename: str):
    """Read the network connections from file."""
    connections = []
    with open(filename) as f:
        for line in f:
            if line.strip():  # Skip empty lines
                comp1, comp2 = line.strip().split('-')
                connections.append((comp1, comp2))
    return connections

def build_graph(connections):
    """Build adjacency list representation of the network."""
    graph = defaultdict(set)
    for comp1, comp2 in connections:
        graph[comp1].add(comp2)
        graph[comp2].add(comp1)
    return graph

def find_triangles(graph):
    """Find all sets of three inter-connected computers."""
    triangles = set()
    computers = list(graph.keys())
    
    for comp in computers:
         
        neighbors = list(graph[comp])
         
        for i in range(len(neighbors)):
            for j in range(i + 1, len(neighbors)):
                
                if neighbors[j] in graph[neighbors[i]]:
                    
                    triangle = tuple(sorted([comp, neighbors[i], neighbors[j]]))
                    triangles.add(triangle)
    
    return triangles

def count_t_triangles(triangles):
    """Count triangles containing at least one computer starting with 't'."""
    return sum(1 for triangle in triangles 
              if any(comp.startswith('t') for comp in triangle))

def solve(filename):
   
    connections = read_network_map(filename)
 
    graph = build_graph(connections)
    
   
    triangles = find_triangles(graph)
    
     
    print("\nAll triangles found:")
    for triangle in sorted(triangles):
        print(','.join(triangle))
    
  
    t_count = count_t_triangles(triangles)
    
    print(f"\nTotal triangles: {len(triangles)}")
    print(f"Triangles with 't' computers: {t_count}")
    
    return t_count

 
result = solve('input.txt')
print(f"\nAnswer: {result}")