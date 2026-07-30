import requests
import uuid
import os
import time

UPLOADS_DIR = r"C:\Users\JuanPerezma\Desktop\Proyecto ecommerce\backend\uploads"
SQL_FILE = r"C:\Users\JuanPerezma\Desktop\Proyecto ecommerce\database\master_products.sql"

if not os.path.exists(UPLOADS_DIR): os.makedirs(UPLOADS_DIR)

API_URL = "https://www.oechsle.pe/api/catalog_system/pub/products/search"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}

def download_image(url, filename):
    try:
        r = requests.get(url, stream=True, timeout=15)
        if r.status_code == 200:
            with open(os.path.join(UPLOADS_DIR, filename), 'wb') as f:
                for chunk in r.iter_content(8192): f.write(chunk)
            return True
    except: pass
    return False

def run():
    print("🚀 TechNova Pro Scraper (API Edition) - Fixing Constraints...")

    categories_config = [
        {"id": 1, "name": "Hombre", "queries": ["camisa", "polera", "jean hombre"]},
        {"id": 2, "name": "Mujer", "queries": ["vestido", "blusa", "falda"]},
        {"id": 3, "name": "Niños", "queries": ["ropa niño", "pijama infantil"]},
        {"id": 4, "name": "Accesorios", "queries": ["reloj", "mochila", "gorra"]}
    ]

    all_products = []
    seen_ids = set()

    for cat_group in categories_config:
        for q in cat_group["queries"]:
            print(f"   🔍 Searching: {q}...")
            try:
                res = requests.get(API_URL, params={"ft": q, "_from": 0, "_to": 24}, headers=HEADERS, timeout=25)
                if res.status_code in [200, 206]:
                    items = res.json()
                    for item in items:
                        p_id = item.get('productId')
                        if p_id in seen_ids: continue

                        try:
                            name = item['productName']
                            offer = item['items'][0]['sellers'][0]['commertialOffer']
                            price = offer['Price']
                            img = item['items'][0]['images'][0]['imageUrl']
                            desc = item.get('description', f"Prenda TechNova: {name}").replace('<p>', '').replace('</p>', '')[:200]

                            if price > 0 and img:
                                local_name = f"{uuid.uuid4()}.jpg"
                                if download_image(img, local_name):
                                    all_products.append({
                                        "n": name, "d": desc, "p": price,
                                        "img": local_name, "cat": cat_group["id"]
                                    })
                                    seen_ids.add(p_id)
                        except: continue
            except: continue
            time.sleep(1)

    if all_products:
        print(f"💾 Writing ROBUST {SQL_FILE}...")
        with open(SQL_FILE, 'w', encoding='utf-8') as f:
            # SANEAMIENTO TOTAL: Incluimos CATEGORIAS para asegurar que el ID 4 exista
            f.write("-- TechNova Master Reset SQL\n")
            f.write("TRUNCATE TABLE orden_detalles, ordenes, productos, categorias RESTART IDENTITY CASCADE;\n\n")

            f.write("-- Garantizar Categorias con IDs fijos\n")
            f.write("INSERT INTO Categorias (id, nombre, descripcion) VALUES (1, 'Hombre', 'Ropa para caballeros');\n")
            f.write("INSERT INTO Categorias (id, nombre, descripcion) VALUES (2, 'Mujer', 'Ropa para damas');\n")
            f.write("INSERT INTO Categorias (id, nombre, descripcion) VALUES (3, 'Niños', 'Ropa infantil');\n")
            f.write("INSERT INTO Categorias (id, nombre, descripcion) VALUES (4, 'Accesorios', 'Complementos y accesorios');\n")
            f.write("SELECT setval('categorias_id_seq', 4);\n\n")

            f.write("-- Insertar Productos Reales\n")
            for p in all_products:
                name = p['n'].replace("'", "''")
                desc = p['d'].replace("'", "''")
                f.write(f"INSERT INTO Productos (nombre, descripcion, precio, stock, imagen_url, categoria_id, talla, color) VALUES ('{name}', '{desc}', {p['p']}, 100, '/api/products/images/{p['img']}', {p['cat']}, 'M', 'Varios');\n")

        print(f"\n✅ ¡ÉXITO! {len(all_products)} productos generados con categorías garantizadas.")

if __name__ == "__main__": run()
