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
    eV = get_connected_V(e, G)
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
        connected_V.update(get_connected_V(e, G))
    
    # Находим все вершины смежные с вершинами в T
    for V in connected_V:
        Ve = get_connected_e(V, G)

        # Находим ребра содержащие внешние вершины
        for e in Ve:
            if e not in T:
                outer_V.add(V)
    return len(outer_V)

def L2(T, e):
    return out_chains(T.union({e}))


def L3(T, e):
    TV = set()
    
    for i in T:
        TV.update(get_connected_V(i, G))

    return len(TV)


def find_max_L1():
    I1 = {}
    max_val = 0
    for e in I:
        temp = L1(e)
        I1[e] = temp
        if max_val < temp:
            max_val = temp
    return [e for (e, val) in I1.items() if val == max_val][0]


def find_outer_connections_less_m(T, I):
    # Находим такие вершины (из нераспределенных) при присоединении которых число внешних связей будет меньше m
    not_distributed = I.difference(T)
    L2_each_e = [(e, L2(T, e)) for e in not_distributed]
    
    return [(e, eL2) for (e, eL2) in L2_each_e if eL2 <= m]

def find_best_with_max_inner_connections(T, I, filtered_e):
    # Находим вершину (из полученных на предыдущем шаге) с максимальным количеством связей с текущим куском
    L3_each_filtered_L2_e = [(e, eL2, L3(T, e)) for (e, eL2) in filtered_e]

    max_val = 0
    for (e, eL2, eL3) in L3_each_filtered_L2_e:
        if max_val < eL3:
            max_val = eL3

    Iv = []
    for (e, eL2, eL3) in L3_each_filtered_L2_e:
        if eL3 == max_val:
            Iv.append((e, eL2, eL3))

    min_L2 = Iv[0]
    if len(Iv) != 0:
        for e in Iv:
            if min_L2[1] > e[1]:
                min_L2 = e

    return min_L2[0]


m = 5 # Ограничение на число внешних связей

parts = []
n_max = 3

while len(I):
    Ee_r = set()
    # первая вершина в куске
    e = find_max_L1()
    Ee_r.add(e)

    if len(I.difference(Ee_r)) == 0:
        parts.append(Ee_r)
        break

    while len(Ee_r) < n_max and len(I.difference(Ee_r)) != 0:
        # остальные
        L2_each_e_filtered = find_outer_connections_less_m(Ee_r, I)

        if (len(L2_each_e_filtered) == 0):
            print('Не возможно')

        Ee_r.add(find_best_with_max_inner_connections(Ee_r, I, L2_each_e_filtered))
        I.difference_update(Ee_r)

    parts.append(Ee_r)

print(parts)