export declare class Observable<T> {
    constructor(value: T);
    value: T;
}
export default function useReactive<T>(value: T): Observable<T>;
