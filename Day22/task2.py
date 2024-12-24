
from collections import defaultdict

def find_largest_fully_connected_group(connections):
   
    graph = defaultdict(set)
    nodes = set()
    
    
    for connection in connections:
        a, b = connection.strip().split('-')
        graph[a].add(b)
        graph[b].add(a)
        nodes.add(a)
        nodes.add(b)

    def is_clique(vertices):
         
        return all(v2 in graph[v1] for v1 in vertices for v2 in vertices if v1 < v2)

    def find_clique_from_vertex(start_vertex, candidates):
        
        clique = {start_vertex}
         
        potential_members = candidates & graph[start_vertex]
        
        while potential_members:
            
            next_vertex = max(potential_members, key=lambda x: len(graph[x] & potential_members))
            clique.add(next_vertex)
             
            potential_members &= graph[next_vertex]
        
        return clique

    max_clique = set()
    # Try starting from each vertex
    for vertex in nodes:
        # Find clique starting from this vertex
        candidates = set(nodes)
        clique = find_clique_from_vertex(vertex, candidates)
        if len(clique) > len(max_clique):
            max_clique = clique

    return sorted(max_clique)

def get_lan_party_password(filename):
     
    with open(filename) as f:
        connections = f.readlines()
    
    largest_group = find_largest_fully_connected_group(connections)
    return ','.join(largest_group)

password = get_lan_party_password('input.txt')
print(f"LAN Party Password: {password}")
