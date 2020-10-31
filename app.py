from aiohttp import web
from comp import compon

async def handle(request):
    return web.json_response(compon())

app = web.Application()
app.add_routes([web.get('/', handle)])

if __name__ == '__main__':
    web.run_app(app)