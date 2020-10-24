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
    eV = [i for i in range(len(G[e])) if G[e][i]]

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


def out_chains(T):
    V_set = set()
    for e in T:
        for V in range(len(G[e])):
            if (G[e][V]):
                V_set.add(V)
    return len(V_set)

def L2(T, e):
    return out_chains(T.union({e}))


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

r = 0 #Номер куска
n_max = 3

r += 1 # Новый кусок
E_r = 0 # Множество вершин в куске r
a = n_max
index = 1

e = find_max_L1()
Ee_r = set()
Ee_r.add(e)

L2_values = dict([(e, L2(e)) for e in I.difference(Ee_r)])
