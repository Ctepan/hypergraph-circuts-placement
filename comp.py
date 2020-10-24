G = [
    [1, 0, 0, 0, 1, 0, 1],
    [0, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1, 1, 0],
]
I = set(range(0, len(G[0]))) # Множество еще не распределенных вершин


# Список номеров ребер V, к  которым относится вершина e
def get_connected_V(e, G):
    return [V for V in range(len(G[e])) if G[e][V]]
    
# Список номеров вершин e, которые включает ребро V
def get_connected_e(V, G):
    return [e for e in range(len(G)) if G[e][V]]

# Количество цепей(ребер) связывающих вершину e с множеством нераспределенных вершин I
def L1(e):
    res = 0
    eV = get_connected_V(e, V)
    for V in eV:
        for i in I:
            if G[i][V]:
                res += 1
                break
    return res

# Количество внешнийх цепей вершин для куска T
def out_chains(T):
    connected_V = set()
    outer_V = set()

    # Находим все ребра соединенные с вершинами в T
    for e in T:
        connected_V.union(set(get_connected_V(e, G)))
    
    # Находим все вершины смежные с вершинами в T
    for V in connected_V:
        Ve = get_connected_e(V, G)

        # Находим ребра содержащие внешние вершины
        for e in Ve:
            if e not in T:
                outer_V.add(V)
    return len(V_set)

def L2(T, e):
    return out_chains(T.union({e}))


def L3(T, e):
    TV = set()
    
    for i in T:
        TV.update(get_connected_V(i))

    return let(TV)


def find_max_L1():
    I1 = {}
    max_val = 0
    for e in I:
        temp = L1(e)
        I1[e] = temp
        if max_val < temp:
            max_val = temp
    return [e for (e, val) in I1.items() if val == max_val][0]

# def find_

m = 3 # Ограничение на число внешних связей

r = 0 # Номер куска
n_max = 3

r += 1 # Новый кусок
E_r = 0 # Множество вершин в куске r
a = n_max
index = 1

e = find_max_L1()
Ee_r = set()
Ee_r.add(e)

not_distributed = I.difference(Ee_r)
L2_each_e = [(e, L2(Ee_r, e)) for e in not_distributed]
L2_each_e_filtered = [(e, eL2) for (e, eL2) in L2_each_e if eL2 <= m]

L3_each_filtered_L2_e = [(e, eL2, L3(e)) for (e, L2) in L2_each_e_filtered]

    