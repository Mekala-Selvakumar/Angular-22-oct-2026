import { from, of, switchMap, delay } from 'rxjs';

export function switchMapDemo1() {
const searchTerms$ = from([
    'Laptop',
    'Keyboard',
    'Monitor'
]);

searchTerms$.pipe(
    switchMap(term =>
        of(`Search result for ${term}`).pipe(
            delay(1000)
        )
    )
).subscribe(console.log);
}