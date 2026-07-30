$uploadsPath = "C:\Users\JuanPerezma\Desktop\Proyecto ecommerce\backend\uploads"
$sqlPath = "C:\Users\JuanPerezma\Desktop\Proyecto ecommerce\database\master_data.sql"

$productos = @(
    @{nombre="Polo Slim Fit Blanco"; desc="Camiseta de algodon organico premium."; precio=45; stock=50; cat=1; talla="M"; color="Blanco"; img_id="1521572163474-6864f9cf17ab"},
    @{nombre="Jean Skinny Azul"; desc="Jean denim con acabado gastado moderno."; precio=89; stock=30; cat=1; talla="32"; color="Azul"; img_id="1542272604-787c3835535d"},
    @{nombre="Casaca Cuero Black"; desc="Chaqueta de cuero sintetico con forro termico."; precio=189; stock=15; cat=1; talla="L"; color="Negro"; img_id="1551028719-00167b16eac5"},
    @{nombre="Polera Urban Gray"; desc="Hoodie comodo ideal para media estacion."; precio=95; stock=40; cat=1; talla="XL"; color="Gris"; img_id="1556821840-3a4e47083aef"},
    @{nombre="Vestido Boho Verano"; desc="Tela fluida de seda con estampado floral."; precio=120; stock=20; cat=2; talla="S"; color="Verde"; img_id="1572804013307-5977a1391507"},
    @{nombre="Blusa Seda Roja"; desc="Diseno elegante con caida premium."; precio=65; stock=25; cat=2; talla="M"; color="Rojo"; img_id="1485462537746-965f33f7f6a7"},
    @{nombre="Blazer Ejecutivo Navy"; desc="Saco formal estructurado para oficina."; precio=145; stock=12; cat=2; talla="L"; color="Azul"; img_id="1548733300-30252326da44"},
    @{nombre="Top Crop Minimal"; desc="Basico esencial de tejido suave."; precio=35; stock=60; cat=2; talla="XS"; color="Blanco"; img_id="1554412930-bc7153b82772"},
    @{nombre="Reloj Silver Tech"; desc="Reloj de acero inoxidable cepillado."; precio=110; stock=15; cat=4; talla="U"; color="Plata"; img_id="1523275335673-31d6cb443942"},
    @{nombre="Gorra Black Edition"; desc="Material transpirable con logo bordado."; precio=49; stock=100; cat=4; talla="U"; color="Negro"; img_id="1556306594-71d950109005"}
)

$sqlContent = "TRUNCATE TABLE orden_detalles, ordenes, productos RESTART IDENTITY CASCADE;`n`n"

foreach ($p in $productos) {
    $uuid = [guid]::NewGuid().ToString()
    $filename = "$uuid`_img.jpg"
    $fullPath = Join-Path $uploadsPath $filename
    $imgUrl = "https://images.unsplash.com/photo-$($p.img_id)?q=80&w=800&auto=format&fit=crop"
    try {
        Invoke-WebRequest -Uri $imgUrl -OutFile $fullPath -ErrorAction Stop
        $sqlContent += "INSERT INTO Productos (nombre, descripcion, precio, stock, imagen_url, categoria_id, talla, color) VALUES ('$($p.nombre)', '$($p.desc)', $($p.precio), $($p.stock), '/api/products/images/$filename', $($p.cat), '$($p.talla)', '$($p.color)');`n"
    } catch { }
}

Set-Content -Path $sqlPath -Value $sqlContent -Encoding utf8
Write-Host "SUCCESS: master_data.sql generated."
