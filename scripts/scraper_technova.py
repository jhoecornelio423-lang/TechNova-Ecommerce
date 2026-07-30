import requests
import uuid
import os
import time

UPLOADS_DIR = r"C:\Users\JuanPerezma\Desktop\Proyecto ecommerce\backend\uploads"
SQL_FILE = r"C:\Users\JuanPerezma\Desktop\Proyecto ecommerce\database\scraped_products.sql"
if not os.path.exists(UPLOADS_DIR): os.makedirs(UPLOADS_DIR)

# Colección Maestra de Moda Real (IDs de Unsplash fijos)
FASHION_COLLECTION = [
    {"n": "Polo Pima White", "id": "1521572163474-6864f9cf17ab", "cat": 1, "d": "Polo de algodon Pima premium."},
    {"n": "Polera Hoodie Urban", "id": "1556821840-3a4e47083aef", "cat": 1, "d": "Hoodie con capucha moderno."},
    {"n": "Blusa Seda Elegance", "id": "1485462537746-965f33f7f6a7", "cat": 2, "d": "Blusa de seda elegante."},
    {"n": "Vestido Floral", "id": "1572804013307-5977a1391507", "cat": 2, "d": "Vestido ligero floral."},
    {"n": "Blazer Ejecutivo", "id": "1548733300-30252326da44", "cat": 2, "d": "Saco formal entallado."},
    {"n": "Reloj Silver Tech", "id": "1523275335673-31d6cb443942", "cat": 4, "d": "Reloj acero inoxidable."},
    {"n": "Gorra Tech Black", "id": "1556306594-71d950109005", "cat": 4, "d": "Gorra urbana ajustable."},
    {"n": "Camisa Oxford Blue", "id": "1489980504781-5e50d376565d", "cat": 1, "d": "Camisa Oxford clasica."}
]

def download(id, filename):
    url = f"https://images.unsplash.com/photo-{id}?q=80&w=800&auto=format&fit=crop"
    try:
        r = requests.get(url, stream=True, timeout=30)
        if r.status_code == 200:
            with open(os.path.join(UPLOADS_DIR, filename), 'wb') as f:
                for chunk in r.iter_content(8192): f.write(chunk)
            return True
    except: pass
    return False

def scrape():
    print("🚀 TechNova Real-Clothing Seeder iniciado...")
    all_p = []

    # Vamos a generar 100 productos usando los 8 maestros (ciclado)
    # Solo descargaremos la imagen fisica UNA VEZ por cada maestro para evitar bloqueos
    # Luego el SQL apuntara a esas imagenes repetidas pero con datos de producto distintos

    master_images = {} # id -> local_filename

    for i in range(100):
        master = FASHION_COLLECTION[i % len(FASHION_COLLECTION)]
        m_id = master['id']

        # Descargar si no la tenemos
        if m_id not in master_images:
            fname = f"{uuid.uuid4()}.jpg"
            print(f"   [*] Descargando imagen nueva para: {master['n']}...")
            if download(m_id, fname):
                master_images[m_id] = fname
                time.sleep(15) # Pausa larga solo en descarga real
            else:
                continue

        # Crear producto unico basado en el maestro
        title = f"{master['n']} Mod. {i+1}"
        all_p.append({
            "n": title,
            "d": master['d'],
            "p": 49 + (i % 20)*5,
            "img": master_images[m_id],
            "cat": master['cat']
        })

    if all_p:
        with open(SQL_FILE, 'w', encoding='utf-8') as f:
            f.write("TRUNCATE TABLE orden_detalles, ordenes, productos RESTART IDENTITY CASCADE;\n\n")
            for p in all_p:
                f.write(f"INSERT INTO Productos (nombre, descripcion, precio, stock, imagen_url, categoria_id, talla, color) VALUES ('{p['n']}', '{p['d']}', {p['p']}, 100, '/api/products/images/{p['img']}', {p['cat']}, 'M', 'Varios');\n")
        print(f"\n✅ EXITOSO: 100 prendas reales generadas con {len(master_images)} imagenes unicas.")

if __name__ == "__main__": scrape()
