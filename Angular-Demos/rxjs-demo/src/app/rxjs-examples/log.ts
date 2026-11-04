import { signal } from "@angular/core";

export function createLog() {
    const lines =signal<string[]>([]);
    return {
        lines,
        add:(msg:string)=>
            lines.update(l=>[...l, `${new Date().toLocaleTimeString()} : ${msg}`]),
        clear:()=>lines.set([])
    }
}

