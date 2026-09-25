// Lista de personajes de One Piece compilada a mano (no existe una API
// pública equivalente a PokeAPI para esta obra). Cubre un buen puñado de
// los personajes más conocidos hasta la saga de Egghead. Si detectas algún
// dato incorrecto, es fácil de corregir aquí mismo.
//
// Campos: id, name (nombre por el que se busca/muestra), arc (arco de
// primera aparición relevante), affiliation (tripulación/organización),
// devilFruit ("Paramecia" | "Zoan" | "Logia" | "Ninguna"), race,
// status ("Vivo" | "Muerto").
//
// Nota: unos pocos datos muy recientes (saga de Egghead) son inciertos
// incluso entre fans porque el manga los ha dejado ambiguos; están
// marcados con un comentario "// dato incierto" junto a la línea.

export const CHARACTERS = [
  { id: 1, name: "Luffy", arc: "Romance Dawn", affiliation: "Piratas de Sombrero de Paja", devilFruit: "Zoan", race: "Humano", status: "Vivo" },
  { id: 2, name: "Zoro", arc: "Romance Dawn", affiliation: "Piratas de Sombrero de Paja", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 3, name: "Nami", arc: "Romance Dawn", affiliation: "Piratas de Sombrero de Paja", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 4, name: "Usopp", arc: "Romance Dawn", affiliation: "Piratas de Sombrero de Paja", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 5, name: "Sanji", arc: "Baratie", affiliation: "Piratas de Sombrero de Paja", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 6, name: "Chopper", arc: "Drum Island", affiliation: "Piratas de Sombrero de Paja", devilFruit: "Paramecia", race: "Reno", status: "Vivo" },
  { id: 7, name: "Robin", arc: "Alabasta", affiliation: "Piratas de Sombrero de Paja", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 8, name: "Franky", arc: "Water Seven", affiliation: "Piratas de Sombrero de Paja", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 9, name: "Brook", arc: "Thriller Bark", affiliation: "Piratas de Sombrero de Paja", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 10, name: "Jinbe", arc: "Arlong Park", affiliation: "Piratas de Sombrero de Paja", devilFruit: "Ninguna", race: "Pez-hombre", status: "Vivo" },

  { id: 11, name: "Buggy", arc: "Romance Dawn", affiliation: "Piratas de Buggy", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 12, name: "Arlong", arc: "Arlong Park", affiliation: "Piratas de Arlong", devilFruit: "Ninguna", race: "Pez-hombre", status: "Vivo" },
  { id: 13, name: "Crocodile", arc: "Alabasta", affiliation: "Baroque Works", devilFruit: "Logia", race: "Humano", status: "Vivo" },
  { id: 14, name: "Vivi", arc: "Alabasta", affiliation: "Reino de Alabasta", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 15, name: "Mr. 1", arc: "Alabasta", affiliation: "Baroque Works", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 16, name: "Enel", arc: "Skypiea", affiliation: "Autoproclamado dios de Skypiea", devilFruit: "Logia", race: "Humano", status: "Vivo" },
  { id: 17, name: "Rob Lucci", arc: "Water Seven", affiliation: "CP9", devilFruit: "Zoan", race: "Humano", status: "Vivo" },
  { id: 18, name: "Kaku", arc: "Water Seven", affiliation: "CP9", devilFruit: "Zoan", race: "Humano", status: "Vivo" },
  { id: 19, name: "Spandam", arc: "Enies Lobby", affiliation: "CP9", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 20, name: "Gecko Moria", arc: "Thriller Bark", affiliation: "Piratas de Moria", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },

  { id: 21, name: "Bartholomew Kuma", arc: "Thriller Bark", affiliation: "Shichibukai", devilFruit: "Paramecia", race: "Humano", status: "Muerto" }, // dato incierto: su final en Egghead es ambiguo en el manga
  { id: 22, name: "Boa Hancock", arc: "Amazon Lily", affiliation: "Piratas Kuja", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 23, name: "Dracule Mihawk", arc: "East Blue", affiliation: "Shichibukai", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 24, name: "Doflamingo", arc: "Dressrosa", affiliation: "Piratas Donquixote", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 25, name: "Barbanegra", arc: "Jaya", affiliation: "Piratas de Barbanegra", devilFruit: "Logia", race: "Humano", status: "Vivo" },

  { id: 26, name: "Shanks", arc: "Romance Dawn", affiliation: "Piratas Pelirrojos", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 27, name: "Barbablanca", arc: "Marineford", affiliation: "Piratas de Barbablanca", devilFruit: "Paramecia", race: "Humano", status: "Muerto" },
  { id: 28, name: "Big Mom", arc: "Whole Cake Island", affiliation: "Piratas de Big Mom", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 29, name: "Kaido", arc: "Wano", affiliation: "Piratas de las Bestias", devilFruit: "Zoan", race: "Humano", status: "Vivo" },

  { id: 30, name: "Sengoku", arc: "Marineford", affiliation: "Marina", devilFruit: "Zoan", race: "Humano", status: "Vivo" },
  { id: 31, name: "Garp", arc: "Marineford", affiliation: "Marina", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 32, name: "Smoker", arc: "Loguetown", affiliation: "Marina", devilFruit: "Logia", race: "Humano", status: "Vivo" },
  { id: 33, name: "Tashigi", arc: "Loguetown", affiliation: "Marina", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 34, name: "Aokiji", arc: "Marineford", affiliation: "Ex Marina", devilFruit: "Logia", race: "Humano", status: "Vivo" },
  { id: 35, name: "Akainu", arc: "Marineford", affiliation: "Marina", devilFruit: "Logia", race: "Humano", status: "Vivo" },
  { id: 36, name: "Kizaru", arc: "Marineford", affiliation: "Marina", devilFruit: "Logia", race: "Humano", status: "Vivo" },
  { id: 37, name: "Fujitora", arc: "Dressrosa", affiliation: "Marina", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 38, name: "Coby", arc: "Romance Dawn", affiliation: "Marina", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 39, name: "Helmeppo", arc: "Romance Dawn", affiliation: "Marina", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },

  { id: 40, name: "Dragon", arc: "Loguetown", affiliation: "Ejército Revolucionario", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 41, name: "Sabo", arc: "Dressrosa", affiliation: "Ejército Revolucionario", devilFruit: "Logia", race: "Humano", status: "Vivo" },
  { id: 42, name: "Ivankov", arc: "Impel Down", affiliation: "Ejército Revolucionario", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 43, name: "Koala", arc: "Punk Hazard", affiliation: "Ejército Revolucionario", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },

  { id: 44, name: "Marco", arc: "Marineford", affiliation: "Piratas de Barbablanca", devilFruit: "Zoan", race: "Humano", status: "Vivo" },
  { id: 45, name: "Ace", arc: "Marineford", affiliation: "Piratas de Barbablanca", devilFruit: "Logia", race: "Humano", status: "Muerto" },
  { id: 46, name: "Jozu", arc: "Marineford", affiliation: "Piratas de Barbablanca", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },

  { id: 47, name: "Katakuri", arc: "Whole Cake Island", affiliation: "Piratas de Big Mom", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 48, name: "Smoothie", arc: "Whole Cake Island", affiliation: "Piratas de Big Mom", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },

  { id: 49, name: "Eustass Kid", arc: "Sabaody", affiliation: "Piratas de Kid", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 50, name: "Killer", arc: "Sabaody", affiliation: "Piratas de Kid", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },

  { id: 51, name: "Trafalgar Law", arc: "Sabaody", affiliation: "Piratas de Corazón", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 52, name: "Bepo", arc: "Sabaody", affiliation: "Piratas de Corazón", devilFruit: "Ninguna", race: "Mink", status: "Vivo" },

  { id: 53, name: "Rebecca", arc: "Dressrosa", affiliation: "Reino de Dressrosa", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 54, name: "Riku Doldo III", arc: "Dressrosa", affiliation: "Reino de Dressrosa", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 55, name: "Viola", arc: "Dressrosa", affiliation: "Reino de Dressrosa", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 56, name: "Kyros", arc: "Dressrosa", affiliation: "Reino de Dressrosa", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 57, name: "Sugar", arc: "Dressrosa", affiliation: "Piratas Donquixote", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },

  { id: 58, name: "Hody Jones", arc: "Fish-Man Island", affiliation: "Nuevos Piratas Pez-hombre", devilFruit: "Ninguna", race: "Pez-hombre", status: "Vivo" },
  { id: 59, name: "Shirahoshi", arc: "Fish-Man Island", affiliation: "Reino de Ryugu", devilFruit: "Ninguna", race: "Sirena", status: "Vivo" },
  { id: 60, name: "Neptuno", arc: "Fish-Man Island", affiliation: "Reino de Ryugu", devilFruit: "Ninguna", race: "Pez-hombre", status: "Vivo" },

  { id: 61, name: "Kozuki Oden", arc: "Wano", affiliation: "Clan Kozuki", devilFruit: "Ninguna", race: "Humano", status: "Muerto" },
  { id: 62, name: "Kin'emon", arc: "Punk Hazard", affiliation: "Clan Kozuki", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 63, name: "Yamato", arc: "Wano", affiliation: "Ex Piratas de las Bestias", devilFruit: "Zoan", race: "Humano", status: "Vivo" },
  { id: 64, name: "Momonosuke", arc: "Wano", affiliation: "Clan Kozuki", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 65, name: "Hiyori", arc: "Wano", affiliation: "Clan Kozuki", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 66, name: "Denjiro", arc: "Wano", affiliation: "Clan Kozuki", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 67, name: "Orochi", arc: "Wano", affiliation: "Shogunato de Wano", devilFruit: "Zoan", race: "Humano", status: "Muerto" },

  { id: 68, name: "Pekoms", arc: "Whole Cake Island", affiliation: "Piratas de Big Mom", devilFruit: "Zoan", race: "Mink", status: "Vivo" },

  { id: 69, name: "Vegapunk", arc: "Egghead", affiliation: "Gobierno Mundial", devilFruit: "Ninguna", race: "Humano", status: "Muerto" }, // dato incierto: su muerte en Egghead se narra de forma confusa (hay varios "Vegapunk")
  { id: 70, name: "Bonney", arc: "Sabaody", affiliation: "Piratas de Bonney", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },

  // --- Ampliación ---

  { id: 71, name: "Cobra", arc: "Alabasta", affiliation: "Reino de Alabasta", devilFruit: "Ninguna", race: "Humano", status: "Muerto" },
  { id: 72, name: "Kuina", arc: "Romance Dawn", affiliation: "Dojo Shimotsuki", devilFruit: "Ninguna", race: "Humano", status: "Muerto" },
  { id: 73, name: "Bellemere", arc: "Arlong Park", affiliation: "Sin afiliación", devilFruit: "Ninguna", race: "Humano", status: "Muerto" },
  { id: 74, name: "Nojiko", arc: "Arlong Park", affiliation: "Sin afiliación", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 75, name: "Zeff", arc: "Baratie", affiliation: "Restaurante Baratie", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 76, name: "Kaya", arc: "Romance Dawn", affiliation: "Sin afiliación", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 77, name: "Tsuru", arc: "Marineford", affiliation: "Marina", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 78, name: "Kalifa", arc: "Water Seven", affiliation: "CP9", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 79, name: "Blueno", arc: "Water Seven", affiliation: "CP9", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 80, name: "Vista", arc: "Marineford", affiliation: "Piratas de Barbablanca", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 81, name: "Izo", arc: "Wano", affiliation: "Piratas de Barbablanca", devilFruit: "Ninguna", race: "Humano", status: "Muerto" },
  { id: 82, name: "Perospero", arc: "Whole Cake Island", affiliation: "Piratas de Big Mom", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 83, name: "Cracker", arc: "Whole Cake Island", affiliation: "Piratas de Big Mom", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 84, name: "Pudding", arc: "Whole Cake Island", affiliation: "Piratas de Big Mom", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 85, name: "Bartolomeo", arc: "Dressrosa", affiliation: "Piratas Barto Club", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 86, name: "Cavendish", arc: "Dressrosa", affiliation: "Piratas de Cavendish", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 87, name: "Trebol", arc: "Dressrosa", affiliation: "Piratas Donquixote", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 88, name: "Senor Pink", arc: "Dressrosa", affiliation: "Piratas Donquixote", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 89, name: "Perona", arc: "Thriller Bark", affiliation: "Piratas de Moria", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 90, name: "Absalom", arc: "Thriller Bark", affiliation: "Piratas de Moria", devilFruit: "Paramecia", race: "Humano", status: "Muerto" },
  { id: 91, name: "Chaka", arc: "Alabasta", affiliation: "Reino de Alabasta", devilFruit: "Zoan", race: "Humano", status: "Vivo" },
  { id: 92, name: "Pell", arc: "Alabasta", affiliation: "Reino de Alabasta", devilFruit: "Zoan", race: "Humano", status: "Vivo" },
  { id: 93, name: "Wyper", arc: "Skypiea", affiliation: "Shandianos", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 94, name: "Gan Fall", arc: "Skypiea", affiliation: "Skypiea", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 95, name: "Paulie", arc: "Water Seven", affiliation: "Astilleros Galley-La", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 96, name: "Iceburg", arc: "Water Seven", affiliation: "Astilleros Galley-La", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 97, name: "Vander Decken IX", arc: "Fish-Man Island", affiliation: "Nuevos Piratas Pez-hombre", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 98, name: "Caesar Clown", arc: "Punk Hazard", affiliation: "Gobierno Mundial (científico)", devilFruit: "Logia", race: "Humano", status: "Vivo" },
  { id: 99, name: "Inuarashi", arc: "Zou", affiliation: "Nación Mokomo", devilFruit: "Zoan", race: "Mink", status: "Vivo" },
  { id: 100, name: "Nekomamushi", arc: "Zou", affiliation: "Nación Mokomo", devilFruit: "Zoan", race: "Mink", status: "Vivo" },
  { id: 101, name: "Carrot", arc: "Zou", affiliation: "Piratas de Sombrero de Paja (aliada)", devilFruit: "Zoan", race: "Mink", status: "Vivo" },
  { id: 102, name: "Jack", arc: "Zou", affiliation: "Piratas de las Bestias", devilFruit: "Zoan", race: "Humano", status: "Vivo" },
  { id: 103, name: "Queen", arc: "Wano", affiliation: "Piratas de las Bestias", devilFruit: "Zoan", race: "Humano", status: "Vivo" },
  { id: 104, name: "King", arc: "Wano", affiliation: "Piratas de las Bestias", devilFruit: "Zoan", race: "Humano", status: "Vivo" }, // dato incierto: su raza (se insinúa "lunariano" pero nunca se confirma del todo)
  { id: 105, name: "Ashura Doji", arc: "Wano", affiliation: "Clan Kozuki", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 106, name: "Kawamatsu", arc: "Wano", affiliation: "Clan Kozuki", devilFruit: "Zoan", race: "Humano", status: "Vivo" },
  { id: 107, name: "Raizo", arc: "Wano", affiliation: "Clan Kozuki", devilFruit: "Ninguna", race: "Humano", status: "Vivo" },
  { id: 108, name: "Kanjuro", arc: "Wano", affiliation: "Clan Kozuki (traidor)", devilFruit: "Ninguna", race: "Humano", status: "Muerto" },
  { id: 109, name: "Mr. 2 Bon Clay", arc: "Alabasta", affiliation: "Baroque Works", devilFruit: "Paramecia", race: "Humano", status: "Muerto" },
  { id: 110, name: "Mr. 3", arc: "Alabasta", affiliation: "Baroque Works", devilFruit: "Paramecia", race: "Humano", status: "Vivo" },
  { id: 111, name: "Stussy", arc: "Sabaody", affiliation: "CP0", devilFruit: "Ninguna", race: "Humano", status: "Vivo" }, // dato incierto: su naturaleza exacta (¿clon?) no queda del todo clara en el manga
];
