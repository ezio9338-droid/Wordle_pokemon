# Pokédle

Un juego tipo Wordle para adivinar un Pokémon secreto. En cada intento se
comparan sus tipos, generación, etapa evolutiva, color, hábitat y categoría
(normal/legendario/mítico) contra el Pokémon secreto, con el mismo esquema de
colores que Wordle (verde = coincide, amarillo = coincide parcialmente,
rojo = no coincide) y flechas ↑/↓ quando el atributo es numérico.

Es una web estática (HTML/CSS/JS puro, sin build ni backend) que consulta los
datos de los Pokémon en vivo a [PokeAPI](https://pokeapi.co).

## Modos de juego

- **Diario**: el Pokémon secreto es el mismo para todo el mundo ese día
  (se calcula de forma determinista a partir de la fecha), con 8 intentos.
- **Ilimitado**: Pokémon aleatorio, puedes empezar una partida nueva cuando
  quieras con el botón "Nueva partida".

Las estadísticas (partidas jugadas, victorias, racha actual y mejor racha) se
guardan en el propio navegador (`localStorage`), por separado para cada modo.

## Jugar en local

No hace falta instalar nada, solo servir los ficheros estáticos (abrir
`index.html` directamente con doble clic puede fallar por CORS en algunos
navegadores al usar módulos JS, así que es mejor levantar un servidor local):

```bash
# Con Python (ya viene instalado en la mayoría de sistemas)
python3 -m http.server 8000

# o con Node
npx serve .
```

Y abre `http://localhost:8000` en el navegador.

## Publicarlo gratis (GitHub Pages)

1. Sube este repositorio a GitHub (o usa el que ya tengas).
2. En el repo: **Settings → Pages**.
3. En "Source" elige la rama (p. ej. `main`) y la carpeta `/ (root)`.
4. Guarda. GitHub te dará una URL tipo
   `https://<tu-usuario>.github.io/<repo>/` en uno o dos minutos.

No requiere servidor propio ni tarjeta de crédito: es una página estática y
las llamadas a PokeAPI las hace el navegador de quien juega.

## Estructura del proyecto

```
index.html          Estructura de la página
css/style.css        Estilos
js/pokeApi.js         Llamadas a PokeAPI + caché en localStorage
js/translations.js    Traducciones al español de tipos, colores, hábitats...
js/game.js            Lógica pura: selección del secreto y comparación
js/main.js            Orquestación de la UI (autocompletado, tabla, estado)
```

## Limitaciones conocidas

- El buscador de Pokémon usa los nombres en inglés tal cual los da PokeAPI
  (p. ej. `mr-mime`), aunque el resultado se muestra en español. Usa el
  desplegable de sugerencias para no tener que saber el nombre exacto.
- Cubre hasta el Pokémon nº 1025 de la Pokédex nacional (generación IX).
