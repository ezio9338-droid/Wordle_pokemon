# Pokédle

Una web con juegos tipo Wordle para adivinar personajes, con una pestaña de
franquicia arriba del todo para elegir entre **Pokémon** y **One Piece**.
Es una web estática (HTML/CSS/JS puro, sin build ni backend).

## Pokémon

En cada intento se comparan sus tipos, generación, etapa evolutiva y color
contra el Pokémon secreto, con el mismo esquema de colores que Wordle
(verde = coincide, amarillo = coincide parcialmente, rojo = no coincide). No
se dan pistas de si el secreto es "mayor" o "menor" en generación o etapa
evolutiva, para mantener el reto. Los datos de los Pokémon se consultan en
vivo a [PokeAPI](https://pokeapi.co).

### Modos de juego

- **Diario**: el Pokémon secreto es el mismo para todo el mundo ese día
  (se calcula de forma determinista a partir de la fecha), con 8 intentos.
- **Ilimitado**: Pokémon aleatorio, puedes empezar una partida nueva cuando
  quieras con el botón "Nueva partida".
- **Silueta**: modo de práctica para aprenderte los nombres. Se muestra la
  silueta en negro de un Pokémon aleatorio (de toda la Pokédex) y hay que
  escribir su nombre, sin límite de intentos. Al acertar o rendirte se
  revela la imagen a color junto con su nombre y generación, para ir
  ubicando qué Pokémon son de qué generación.

Las estadísticas (partidas jugadas, victorias, racha actual y mejor racha) se
guardan en el propio navegador (`localStorage`), por separado para cada modo.

## One Piece

No existe una API pública equivalente a PokeAPI para One Piece, así que los
datos son una lista compilada a mano (`js/onePieceData.js`) con más de 110
personajes conocidos hasta la saga de Egghead. En cada intento se compara el
arco de primera aparición, la tripulación/afiliación, el tipo de fruta del
diablo (Paramecia/Zoan/Logia/Ninguna), la raza y si el personaje sigue
vivo o no. Tiene modo **Diario** e **Ilimitado**, igual que Pokémon, pero
sin modo Silueta (no hay una fuente de imágenes libres de derechos para los
personajes, así que este modo se queda solo para Pokémon por ahora).

Un puñado de datos muy recientes (saga de Egghead) están marcados en el
propio fichero con el comentario `// dato incierto`, porque el manga los deja
ambiguos incluso para los fans; corrígelos si tienes más información.

Si detectas algún dato incorrecto de algún personaje, es fácil de corregir
directamente en `js/onePieceData.js`.

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
index.html            Estructura de la página (ambas franquicias)
css/style.css          Estilos
js/pokeApi.js          Llamadas a PokeAPI + caché en localStorage
js/translations.js     Traducciones al español de tipos, colores...
js/game.js             Lógica pura de Pokémon: secreto y comparación
js/onePieceData.js     Lista de personajes de One Piece (datos estáticos)
js/onePieceGame.js     Lógica pura de One Piece: secreto y comparación
js/main.js             Orquestación de la UI de ambos juegos
```

## Limitaciones conocidas

- El buscador de Pokémon usa los nombres en inglés tal cual los da PokeAPI
  (p. ej. `mr-mime`), aunque el resultado se muestra en español. Usa el
  desplegable de sugerencias para no tener que saber el nombre exacto.
- Cubre hasta el Pokémon nº 1025 de la Pokédex nacional (generación IX).
