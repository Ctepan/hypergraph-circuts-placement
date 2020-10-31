from aiohttp import web
from comp import compon

async def comp_graph(request):
    return web.json_response(compon())

async def index(request):
    return web.json_response(compon())

app = web.Application()
app.add_routes([
    # web.get('/', index),
    web.get('/comp', comp_graph),
    web.static('/static', './static'),
    web.static('/', './')
])

if __name__ == '__main__':
    web.run_app(app)