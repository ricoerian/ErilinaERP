import { LucideIcon } from 'lucide-react';

export interface Submenu {
 name: string;
 href: string;
 Icon?: LucideIcon;
}

export interface Module {
 name: string;
 href: string;
 Icon: LucideIcon;
 submenus?: Submenu[];
}