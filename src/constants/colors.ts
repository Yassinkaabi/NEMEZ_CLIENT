export const COLOR_MAP: { [key: string]: string } = {
    'noir': '#000000',
    'blanc': '#FFFFFF',
    'gris': '#808080',
    'rouge': '#ff4136',
    'bleu': '#0074d9',
    'vert': '#2ecc40',
    'jaune': '#FFFF00',
    'orange': '#FFA500',
    'violet': '#800080',
    'rose': '#FFC0CB',
    'marron': '#8b4513',
    'beige': '#F5F5DC',

    // Nuances de bleu
    'bleu marine': '#000080',
    'bleu ciel': '#87CEEB',
    'bleu royal': '#4169E1',
    'turquoise': '#40E0D0',
    'cyan': '#00FFFF',

    // Nuances de rouge
    'rouge foncé': '#8B0000',
    'rougeBordeaux': '#800020',
    'rouge vif': '#FF0000',
    'corail': '#FF7F50',
    'rouge brique': '#B22222',

    // Nuances de vert
    'vert foncé': '#006400',
    'vert clair': '#90EE90',
    'vert olive': '#808000',
    'vert menthe': '#98FF98',
    'vert émeraude': '#50C878',

    // Nuances de gris
    'gris clair': '#D3D3D3',
    'gris foncé': '#A9A9A9',
    'argent': '#C0C0C0',
    'anthracite': '#3A3A3A',

    // Autres couleurs
    'or': '#FFD700',
    'bronze': '#CD7F32',
    'crème': '#FFFDD0',
    'ivoire': '#FFFFF0',
    'kaki': '#C3B091',
    'lavande': '#E6E6FA',
    'magenta': '#FF00FF',
    'navy': '#000080',
    'pêche': '#FFE5B4',
    'prune': '#8E4585',
    'saumon': '#FA8072',
    'taupe': '#483C32',
};

export const COLOR_PRESETS = Object.entries(COLOR_MAP).map(([name, hex]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: name,
    hex: hex
}));
