function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove acentos: á -> a, é -> e, etc.
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

console.log('Aniversário ->', slugify('Aniversário'));
console.log('Gravidez ->', slugify('Gravidez'));
console.log('Mêsversário ->', slugify('Mêsversário'));
console.log('Recém-nascido ->', slugify('Recém-nascido'));
console.log('Sensual ->', slugify('Sensual'));
console.log('Casamento ->', slugify('Casamento'));
console.log('Debutante ->', slugify('Debutante'));
