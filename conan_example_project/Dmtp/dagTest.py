import matplotlib.pyplot as plt
import networkx as nx


# https://mungingdata.com/python/dag-directed-acyclic-graph-networkx/
def method_name(graphs):
    composed = graphs[0]
    if len(graphs) >= 2:
        for graph in graphs[1:]:
            composed = nx.compose(composed, graph)

    def find_roots():
        # https://stackoverflow.com/questions/62468287/finding-all-the-roots-inside-a-digraph-networkx
        roots = []
        for component in nx.weakly_connected_components(composed):
            composed_sub = composed.subgraph(component)
            roots.extend([n for n, d in composed_sub.in_degree() if d == 0])
        return roots

    roots = find_roots()
    print(f"Roots      : {roots}")
    print(f"Is Directed: {nx.is_directed(composed)}")
    print(f"Nodes      : {composed.nodes()}")
    print(f"Edged      : {composed.edges()}")
    print(f"BuildOrder : {list(nx.topological_sort(composed))}")
    plt.subplots(figsize=(12, 6))
    nx.draw(composed, with_labels=True, node_color='lightblue', node_size=500)


G1 = nx.DiGraph()
G1.add_edges_from([("a", "b"), ("a", "e")])
G2 = nx.DiGraph()
G2.add_edges_from([("a2", "b"), ("b", "c"), ("b", "d"), ("d", "e")])
# redundanter graph zum test
G3 = nx.DiGraph()
G3.add_edges_from([("a", "b"), ("b", "d")])
method_name(
    [
        G1,
        G2
    ]
)
