import { Injectable } from "@angular/core"

export interface Menu {
    state: string,
    name: string,
    icon: string,
    role: string
}

const menuItem = [
    { state: 'dashboard', name: 'Dashboard', icon: 'dashboard', role: '' },
    { state: 'dashboard', name: 'Manage Category', icon: 'category', role: 'admin' },
    { state: 'product', name: 'Manage Product', icon: 'inventroy_2', role: 'admin' },
    { state: 'order', name: 'Manage Order', icon: 'list_alt', role: '' },
]


@Injectable()
export class MenuItems {
    getMenu(): Menu[] {
        return menuItem
    }
}