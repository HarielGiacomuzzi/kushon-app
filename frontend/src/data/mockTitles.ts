export interface Volume {
  number: number;
  title: string;
  cover: string;
  owned: boolean;
}

export interface Title {
  id: string;
  name: string;
  synopsis: string;
  image: string;
  totalVolumes: number;
  userVolumes: number;
  genre: string;
  author: string;
  volumes: Volume[];
}

const generateVolumes = (totalVolumes: number, ownedCount: number, titleName: string, baseColor: string): Volume[] => {
  const volumes: Volume[] = [];
  for (let i = 1; i <= totalVolumes; i++) {
    volumes.push({
      number: i,
      title: `${titleName} Vol. ${i}`,
      cover: `https://via.placeholder.com/150x200/${baseColor}/ffffff?text=Vol.${i}`,
      owned: i <= ownedCount
    });
  }
  return volumes;
};

export const mockTitles: Title[] = [
  {
    id: '1',
    name: 'One Piece',
    synopsis: 'Monkey D. Luffy sonha em se tornar o Rei dos Piratas. Junto com sua tripulação diversificada, ele navega pela Grand Line em busca do tesouro lendário conhecido como One Piece.',
    image: 'https://via.placeholder.com/300x400/3498db/ffffff?text=One+Piece',
    totalVolumes: 15,
    userVolumes: 8,
    genre: 'Aventura, Shonen',
    author: 'Eiichiro Oda',
    volumes: generateVolumes(15, 8, 'One Piece', '3498db')
  },
  {
    id: '2',
    name: 'Attack on Titan',
    synopsis: 'A humanidade vive confinada dentro de muralhas gigantescas para se proteger de titãs devoradores de humanos. Eren Yeager jura exterminar todos os titãs após sua cidade natal ser destruída.',
    image: 'https://via.placeholder.com/300x400/e74c3c/ffffff?text=Attack+on+Titan',
    totalVolumes: 12,
    userVolumes: 12,
    genre: 'Ação, Drama',
    author: 'Hajime Isayama',
    volumes: generateVolumes(12, 12, 'Attack on Titan', 'e74c3c')
  },
  {
    id: '3',
    name: 'Death Note',
    synopsis: 'Light Yagami, um estudante brilhante, encontra um caderno sobrenatural que pode matar qualquer pessoa cujo nome seja escrito nele. Ele decide criar um mundo sem crime.',
    image: 'https://via.placeholder.com/300x400/2c3e50/ffffff?text=Death+Note',
    totalVolumes: 12,
    userVolumes: 8,
    genre: 'Suspense, Sobrenatural',
    author: 'Tsugumi Ohba',
    volumes: generateVolumes(12, 8, 'Death Note', '2c3e50')
  },
  {
    id: '4',
    name: 'Naruto',
    synopsis: 'Naruto Uzumaki é um jovem ninja que busca reconhecimento de seus pares e sonha em se tornar o Hokage, o líder de sua vila.',
    image: 'https://via.placeholder.com/300x400/f39c12/ffffff?text=Naruto',
    totalVolumes: 20,
    userVolumes: 15,
    genre: 'Ação, Shonen',
    author: 'Masashi Kishimoto',
    volumes: generateVolumes(20, 15, 'Naruto', 'f39c12')
  },
  {
    id: '5',
    name: 'Tokyo Ghoul',
    synopsis: 'Ken Kaneki é transformado em meio-ghoul após um encontro quase fatal. Agora ele deve navegar entre o mundo humano e ghoul enquanto luta para manter sua humanidade.',
    image: 'https://via.placeholder.com/300x400/9b59b6/ffffff?text=Tokyo+Ghoul',
    totalVolumes: 14,
    userVolumes: 10,
    genre: 'Terror, Sobrenatural',
    author: 'Sui Ishida',
    volumes: generateVolumes(14, 10, 'Tokyo Ghoul', '9b59b6')
  }
];