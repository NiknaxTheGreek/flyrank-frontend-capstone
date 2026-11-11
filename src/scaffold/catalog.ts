export const catalog = [
 {id:'tt1375666',title:'Inception',year:'2010',genre:'Sci-Fi',plot:'Explore the movie-details layout with this sample title.'},
 {id:'tt0111161',title:'The Shawshank Redemption',year:'1994',genre:'Drama',plot:'A sample card for the discovery screen.'},
 {id:'tt0816692',title:'Interstellar',year:'2014',genre:'Sci-Fi',plot:'A sample card for genre filtering and navigation.'},
];
export type SearchParams = Record<string, string | string[] | undefined>;
export function single(value: string | string[] | undefined) { return typeof value === 'string' ? value : ''; }
export function safeReturn(value: string | string[] | undefined) {
 const path = single(value);
 return /^\/(?:movies(?:\/tt\d{7,10})?|favorites)?(?:\?[^\\]*)?$/.test(path) ? path : '/favorites';
}
